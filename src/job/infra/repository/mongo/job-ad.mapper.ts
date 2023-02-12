import JobAd, { State } from '@/job/domain/entity/job.entity';
import DomainJobAd from '@/job/domain/entity/job.entity';
import { Job, JobAdView } from './job-ad.model';

export class JobAdMapper {
	static toDomain(data: Partial<JobAdView>): JobAd {
		const state: State = {
			id: data._id,
			title: data.title,
			description: data.description,
			salary: data.salary,
			hideSalary: data.hideSalary,
			status: data.status,
			owner: data.owner,
			editors: data.editors,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			__v: data.__v,
		} as any;

		return new JobAd(state);
	}

	static toData(data: Partial<DomainJobAd>): Job {
		const job = new Job();
		if (data.title) job.title = data.title;
		if (data.description) job.description = data.description;
		if (data.salary) job.salary = data.salary;
		if (data.isSalaryHidden) job.hideSalary = data.isSalaryHidden;
		if (data.status) job.status = data.status;
		if (data.editors) {
			if (!job.editors) job.editors = [];
			job.editors.push(...data.editors);
		}

		return job;
	}

	static toState(data: Partial<DomainJobAd>): Job {
		const job = new Job();
		if (data.id) job._id = data.id;
		if (data.title) job.title = data.title;
		if (data.description) job.description = data.description;
		if (data.salary) job.salary = data.salary;
		if (data.isSalaryHidden) job.hideSalary = data.isSalaryHidden;
		if (data.status) job.status = data.status;
		if (data.editors) job.editors = data.editors;
		if (data.createdAt) job.createdAt = data.createdAt;
		if (data.updatedAt) job.updatedAt = data.updatedAt;
		if (data.version) job.__v = data.version;

		return job;
	}
}
