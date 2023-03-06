import { Inject, Injectable } from '@nestjs/common';
import PaginationPresenter from '@/@shared/repository/presenter/pagination.presenter';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import JobAd from '../domain/entity/job.entity';
import { Filters } from '../domain/filters/filters';
import { FindJobByIDUseCase } from '../usecase/find-by-id/find-by-id.job.usecase';
import { ListJobsUseCase } from '../usecase/list/list.usecase';
import JobFacadeInterface from './job.facade.interface';

@Injectable()
export class JobFacade implements JobFacadeInterface {
	constructor(
		@Inject(FindJobByIDUseCase)
		private readonly findJobByIDUseCase: UseCaseInterface,
		@Inject(ListJobsUseCase)
		private readonly findJobsUseCase: UseCaseInterface,
	) {}

	async getJobByID(id: string): Promise<JobAd> {
		return this.findJobByIDUseCase.execute({ id });
	}

	async getJobs(filters: Filters): Promise<PaginationPresenter<JobAd>> {
		return this.findJobsUseCase.execute(filters);
	}
}
