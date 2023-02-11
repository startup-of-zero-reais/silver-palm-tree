import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import JobAd from '@/job/domain/entity/job.entity';
import { Event as DomainEvent } from '@/job/domain/events/event';
import { EventMapper } from './event.mapper';
import { JobAdMapper } from './job-ad.mapper';
import {
	Event,
	Job,
	JobAd as JobAdEntity,
	JobAdDocument,
	JobAdView,
	JobAdViewDocument,
} from './job-ad.model';

@Injectable()
export class JobAdMongoRepository {
	constructor(
		@InjectModel(JobAdEntity.name)
		private readonly jobAdModel: Model<JobAdDocument>,
		@InjectModel(JobAdView.name)
		private readonly jobAdView: Model<JobAdViewDocument>,
	) {}

	async getJob(jobAd: { id: string }): Promise<JobAd> {
		const job = await this.jobAdView.findOne({ _id: jobAd.id }).exec();

		if (!job) {
			return null;
		}

		return JobAdMapper.toDomain(job);
	}

	async putEvent(_event: DomainEvent) {
		const event = EventMapper.toEvent(_event);

		const jobID = _event.data().id;

		if (!jobID)
			throw new HttpErrorException(
				'can not put an event for a unknown job',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);

		// search job based on event
		const job = await this.jobAdModel.findOne({ _id: jobID }).exec();

		// only create new job to created action
		if (!job && _event.action() === 'jobad.created') {
			await this.jobAdModel.create({
				_id: jobID,
				events: [event],
				state: {},
				__v: 0,
			});
		}

		// any action who is not created will update job
		if (job && _event.action() !== 'jobad.created') {
			event.__v = job.events.length;

			await this.jobAdModel.findOneAndUpdate(
				{ _id: jobID },
				{ $push: { events: [event] } },
			);
		}

		await this.materializeView(jobID, job.__v);

		return;
	}

	private async materializeView(jobID: string, __v = -1) {
		await this.jobAdModel.aggregate([
			{ $match: { _id: jobID, __v: { $gt: __v } } },
			{
				$group: {
					_id: '$_id',
					state: {
						$accumulator: {
							init: this.dumbStep(),
							accumulateArgs: ['$events', '$__v'],
							accumulate: this.accumulate(),
							merge: this.dumbStep(),
							lang: 'js',
						},
					},
				},
			},
			{
				$merge: {
					into: 'jobads_view',
					whenMatched: 'replace',
					whenNotMatched: 'insert',
				},
			},
		]);
	}

	private accumulate() {
		return function (state: Job, events: Event[], __v = 0) {
			for (const event of events) {
				if (event.data && (__v == 0 || event.__v > __v)) {
					Object.assign(state, event.data);
					state.__v = event.__v;
				}
			}

			return state;
		};
	}

	private dumbStep() {
		return function (finalState) {
			return finalState ?? {};
		};
	}
}
