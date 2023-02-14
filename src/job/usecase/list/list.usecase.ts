import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { JobAdMongoRepository } from '@/job/infra/repository/mongo/job-ad.repository';
import { ListJobsInputDTO } from './list.dto';

@Injectable()
export class ListJobsUseCase implements UseCaseInterface {
	constructor(
		@Inject(JobAdMongoRepository)
		private readonly repository: JobAdMongoRepository,
	) {}

	async execute(input: ListJobsInputDTO): Promise<any> {
		return this.repository.paginate(input.page, input.per_page);
	}
}
