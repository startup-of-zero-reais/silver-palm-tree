import JobAd, { State } from '@/job/domain/entity/job.entity';
import DomainJobAd from '@/job/domain/entity/job.entity';
import { Job, JobAdView } from './job-ad.model';

export class JobAdMapper {
	static toDomain(data: Partial<JobAdView>): JobAd {
		const state: State = {
			id: data._id,
			title: data.state.title,
			description: data.state.description,
			salary: data.state.salary,
			hideSalary: data.state.hideSalary,
			status: data.state.status,
			owner: data.state.owner,
			editors: data.state.editors,
			createdAt: data.state.createdAt,
			updatedAt: data.state.updatedAt,
			__v: data.__v,
		} as any;

		return new JobAd(state);
	}

	static toData(data: Partial<DomainJobAd>): Job {
		const job = new Job();
		job.title = data.title;
		job.description = data.description;
		job.salary = data.salary;
		job.hideSalary = data.isSalaryHidden;
		job.status = data.status;

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
		if (data.createdAt) job.createdAt = data.createdAt;
		if (data.updatedAt) job.updatedAt = data.updatedAt;

		return job;
	}
}
