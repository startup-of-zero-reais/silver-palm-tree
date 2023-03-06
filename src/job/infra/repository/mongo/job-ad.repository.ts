import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, SortOrder } from 'mongoose';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import { isEmpty } from '@/@shared/helpers/prop-checkers';
import PaginationPresenter from '@/@shared/repository/presenter/pagination.presenter';
import JobAd, { Status } from '@/job/domain/entity/job.entity';
import { Event as DomainEvent } from '@/job/domain/events/event';
import { Filters } from '@/job/domain/filters/filters';
import { aggregateCompany } from './aggregate-company.pipeline-stage';
import { EventMapper } from './event.mapper';
import { JobAdMapper } from './job-ad.mapper';
import {
	Job,
	JobAd as JobAdEntity,
	JobAdDocument,
	JobAdView,
	JobAdViewDocument,
} from './job-ad.model';

type Sorter = Record<string, SortOrder> | { $meta: 'textScore' };

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

		const job = await this.jobAdView
			.findById(jobAd.id)
			.populate('company')
			.exec();

		if (!job) {
			return null;
		}

		return JobAdMapper.toDomain(job);
	}

	async paginate(
		page = 1,
		per_page = 30,
		search = '',
		filters: Filters = {},
	) {
		// ensureIndexes grants the indexes were created
		// on query jobs
		await this.jobAdView.ensureIndexes();

		if (!filters.status) filters.status = [Status.ACTIVATED];

		let filterQuery: FilterQuery<JobAdViewDocument> = {
			status: { $in: filters.status },
		};

		let projection: ProjectionType<JobAdViewDocument> = undefined;
		const sorter: Sorter = {};

		if (search) {
			filterQuery = {
				$and: [
					{ status: { $in: filters.status } },
					{ $text: { $search: search } },
				],
			};

			// project a score field based on textScore search
			projection = { score: { $meta: 'textScore' } };

			// add score as sorter, to better search matching
			Object.assign(sorter, { score: { $meta: 'textScore' } });
		}

		this.applyFilters(filterQuery, filters, !!search);

		// as fallback order by createdAt
		sorter.createdAt = 'desc';

		const [total, jobs] = await Promise.all([
			this.jobAdView.find(filterQuery, projection).countDocuments(),

			this.jobAdView
				.aggregate(
					aggregateCompany(
						filterQuery,
						Boolean(search),
						(page - 1) * per_page,
						per_page,
					),
				)
				.sort(sorter),
		]);

		return new PaginationPresenter(
			jobs.map(JobAdMapper.toDomain),
			total,
			per_page,
			page,
		);
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

		const job = JobAdMapper.toDomain(viewJob);
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

	private applyFilters(
		query: FilterQuery<JobAdViewDocument>,
		filters: Filters = {},
		hasSearch = false,
	) {
		if (!isEmpty(filters)) {
			const additionalFilters: FilterQuery<JobAdViewDocument> = {};
			if (filters.contracts)
				additionalFilters.contracts = {
					$in: filters.contracts.map(
						(contract) => new RegExp(`^${contract}$`, 'i'),
					),
				};
			if (filters.techs) {
				additionalFilters.techs = {
					$in: filters.techs.map(
						(tech) => new RegExp(`^${tech}$`, 'i'),
					),
				};
			}
			if (filters.location) {
				additionalFilters.location = {
					$regex: new RegExp(`^${filters.location}$`, 'i'),
				};
			}

			if (filters.recruiter)
				additionalFilters.$or = [
					{ owner: filters.recruiter },
					{ editors: { $in: [filters.recruiter] } },
				];

			const salary = {};
			if (filters.minSalary)
				Object.assign(salary, { $gte: filters.minSalary * 100 });
			if (filters.maxSalary)
				Object.assign(salary, { $lte: filters.maxSalary * 100 });

			if (!isEmpty(salary)) Object.assign(additionalFilters, { salary });

			if (filters.availability)
				additionalFilters.availability = {
					$regex: new RegExp(`^${filters.availability}$`, 'i'),
				};

			if (hasSearch && !isEmpty(query.$and)) {
				query.$and.push(additionalFilters);
			} else {
				Object.assign(query, additionalFilters);
			}
		}
	}
}
