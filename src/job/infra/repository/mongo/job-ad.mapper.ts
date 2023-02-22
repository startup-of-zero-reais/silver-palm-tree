/* eslint-disable prettier/prettier */
import { ObjectTransformer } from '@/@shared/helpers';
import JobAd, { State } from '@/job/domain/entity/job.entity';
import DomainJobAd from '@/job/domain/entity/job.entity';
import { Job, JobAdView } from './job-ad.model';

export class JobAdMapper {
	static toDomain(data: Partial<JobAdView>): JobAd {
		const state = ObjectTransformer.transform<Partial<JobAdView>, State>(
			data,
		)
			.property('_id').to('id')
			.property('title').to('title')
			.property('description').to('description')
			.property('salary').to('salary')
			.property('hideSalary').to('hideSalary')
			.property('status').to('status')
			.property('owner').to('owner')
			.property('companyID').to('companyID')
			.property('availability').to('availability')
			.property('createdAt').to('createdAt')
			.property('updatedAt').to('updatedAt')
			.property('editors').to('editors')
			.property('techs').to('techs')
			.property('contracts').to('contracts')
			.property('location').to('location')
			.property('__v').to('__v')
			.transformed();

		const jobad = new JobAd(state);

		if ('company' in data) {
			jobad.attachCompany(data.company as any);
		}


		return jobad;
	}

	static toData(data: Partial<DomainJobAd>): Job {
		const job = new Job();

		if (data.title) job.title = data.title;
		if (data.description) job.description = data.description;
		if (data.salary) job.salary = data.salary;
		if (typeof data.isSalaryHidden !== 'undefined')
			job.hideSalary = data.isSalaryHidden;
		if (data.status) job.status = data.status;
		if (data.owner) job.owner = data.owner;
		if (data.editors) {
			if (!job.editors) job.editors = [];
			job.editors.push(...data.editors);
		}
		if (data.companyID) job.companyID = data.companyID;
		if (data.contracts) job.contracts = data.contracts;
		if (data.techs) job.techs = data.techs;
		if (data.availability) job.availability = data.availability;
		if (data.location) job.location = data.location;

		return job;
	}

	static toState(data: Partial<DomainJobAd>): Job {
		const job = new Job();

		if (data.id) job._id = data.id;
		if (data.title) job.title = data.title;
		if (data.description) job.description = data.description;
		if (data.salary) job.salary = data.salary;
		if (typeof data.isSalaryHidden !== 'undefined')
			job.hideSalary = data.isSalaryHidden;
		if (data.status) job.status = data.status;
		if (data.owner) job.owner = data.owner;
		if (data.editors) job.editors = data.editors;
		if (data.companyID) job.companyID = data.companyID;
		if (data.contracts) job.contracts = data.contracts;
		if (data.techs) job.techs = data.techs;
		if (data.availability) job.availability = data.availability;
		if (data.createdAt) job.createdAt = data.createdAt;
		if (data.updatedAt) job.updatedAt = data.updatedAt;
		if (data.location) job.location = data.location;
		if (data.version) job.__v = data.version;

		return job;
	}
}
