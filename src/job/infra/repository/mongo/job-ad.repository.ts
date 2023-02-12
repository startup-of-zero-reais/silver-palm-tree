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
		await this.materializeView(jobAd.id);
		const job = await this.jobAdView.findById(jobAd.id).exec();

		if (!job) {
			return null;
		}

		return JobAdMapper.toDomain(job);
	}

	async putEvent(_event: DomainEvent) {
		const event = EventMapper.toEvent(_event);

		let jobID = _event.data().id;

		if (!jobID)
			throw new HttpErrorException(
				'can not put an event for a unknown job',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);

		// search job based on event
		const job = await this.jobAdModel.findOne({ _id: jobID }).exec();

		// only create new job to created action
		if (!job && _event.action() === 'jobad.created') {
			const newJob = await this.jobAdModel.create({
				_id: jobID,
				events: [event],
				__v: -1,
			});

			jobID = newJob._id;
		}

		// any action who is not created will update job
		if (job && _event.action() !== 'jobad.created') {
			event.__v = job.events.length;

			await this.jobAdModel.findOneAndUpdate(
				{ _id: jobID },
				{ $push: { events: [event] } },
			);
		}

		await this.materializeView(jobID);

		return;
	}

	private async materializeView(jobID: string) {
		const [jobHistory, viewJobResult] = await Promise.all([
			this.jobAdModel.findById(jobID).exec(),
			this.jobAdView.findById(jobID).exec(),
		]);

		// if has no history do nothing. The job does not exists
		if (!jobHistory) return;

		let viewJob = new Job(); // initialize viewJob
		// if already exists viewJobResult define viewJob with current
		// view state
		if (viewJobResult) viewJob = viewJobResult;

		// initialize events to compile
		let events: DomainEvent[] = [];
		for (const event of jobHistory.events) {
			// only append new events, who has not compiled yet
			if (viewJob.__v < event.__v || viewJob.__v == 0)
				events.push(EventMapper.toDomain(event));
		}

		// if has no events to compile just ignore new materialize
		if (events.length == 0) return;
		// sort events ASC by event version (__v)
		events = events.sort((a, b) => a.__v - b.__v);

		const job = new JobAd();
		job.putEvents(...events).compileEvents();

		// materialize state
		const materializedState = JobAdMapper.toState(job);
		// removes immutable _id from materialized state
		// _id should never be updated
		delete materializedState._id;

		// materialize it on jobAdView collection
		await this.jobAdModel.aggregate([
			{ $match: { _id: jobID } },
			{ $group: { _id: '$_id' } },
			{ $set: materializedState },
			{
				$merge: {
					into: this.jobAdView.collection.collectionName,
					whenNotMatched: 'insert',
					whenMatched: 'replace',
				},
			},
		]);
	}

	private accumulate() {
		return function (state: Job, events: Event[], __v = 0) {
			events.sort((a, b) => a.__v - b.__v);
			for (const event of events) {
				// if has no data on event or initial __v of job
				// is greather than 0 and event __v is less than or equal
				// job initial __v
				//
				// in this case, pass by to the next event
				if (!event.data || (__v > 0 && event.__v <= __v)) {
					continue;
				}

				// to every key in event data we check a lot of conditions
				for (const k of Object.keys(event.data)) {
					const data = event.data[k];

					// go to next event data key
					// data empty
					if (typeof data === 'undefined') {
						continue;
					}

					if (
						// when has no state prop or has state prop and this
						// has the same type of data but...
						(!state[k] || typeof state[k] == typeof data) &&
						// data can not be an array (type object) or a
						// object.
						//
						// then we set state prop with a primitive value (string,
						// number, boolean...)
						typeof data !== 'object'
					) {
						state[k] = data;
						continue;
					}

					// when state prop and data are objects assign objects
					if (isObject(state[k]) && isObject(data)) {
						Object.assign(state[k], data);
						continue;
					}

					if (!state[k] && Array.isArray(data)) {
						state[k] = data;
						continue;
					}

					// when state prop is an array. editors as example
					// if data came as array we need to merge
					if (Array.isArray(state[k]) && Array.isArray(data)) {
						state[k].push(...data);
					}
				}

				state.__v = event.__v;
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

function isObject(input: any): boolean {
	return typeof input === 'object' && !Array.isArray(input);
}
