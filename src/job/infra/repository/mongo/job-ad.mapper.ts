/* eslint-disable prettier/prettier */
import { ObjectTransformer } from '@/@shared/helpers';
import Company from '@/company/domain/entity/company.entity';
import { CompanyMapper } from '@/company/infra/repository/mongo/company.mapper';
import JobAd, { State } from '@/job/domain/entity/job.entity';
import { Job as JobEntity, JobAdView } from './job-ad.model';

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
			.property('availability').to('availability')
			.property('createdAt').to('createdAt')
			.property('updatedAt').to('updatedAt')
			.property('editors').to('editors')
			.property('techs').to('techs')
			.property('contracts').to('contracts')
			.property('location').to('location')
			.property('createdAt').to('createdAt')
			.property('updatedAt').to('updatedAt')
			.property('__v').to('__v')
			.transformed();

		const jobad = new JobAd(state);

		if ('company' in data && data.company) {
			const company = CompanyMapper.toDomain(data.company)
			jobad.attachCompany(company);
		}

		return jobad;
	}

	static toData(data: Partial<JobAd>): JobEntity {
		const job = ObjectTransformer.transform<Partial<JobAd>, JobEntity>(data)
			.property('title').to('title')
			.property('description').to('description')
			.property('salary').to('salary')
			.property('isSalaryHidden').to('hideSalary')
			.property('status').to('status')
			.property('owner').to('owner')
			.property('contracts').to('contracts')
			.property('techs').to('techs')
			.property('availability').to('availability')
			.property('location').to('location')
			.property('createdAt').to('createdAt')
			.property('updatedAt').to('updatedAt')
			.transformed()

		if ('company' in data) {
			job.company = data.company instanceof Company
				? CompanyMapper.toEntity(data.company)
				: data.company as any;
		}

		if (data.editors) {
			if (!job.editors) job.editors = [];
			job.editors.push(...data.editors);
		}

		return job;
	}

	static toState(data: Partial<JobAd>): JobEntity {
		const job = ObjectTransformer.transform<Partial<JobAd>, JobEntity>(data)
			.property('title').to('title')
			.property('description').to('description')
			.property('salary').to('salary')
			.property('isSalaryHidden').to('hideSalary')
			.property('status').to('status')
			.property('owner').to('owner')
			.property('editors').to('editors')
			.property('contracts').to('contracts')
			.property('techs').to('techs')
			.property('availability').to('availability')
			.property('location').to('location')
			.property('version').to('__v')
			.property('company.id').to('company._id')
			.property('createdAt').to('createdAt')
			.property('updatedAt').to('updatedAt')
			.transformed()


		return job;
	}
}
