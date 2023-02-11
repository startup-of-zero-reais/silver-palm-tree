import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { JobAdMongoRepository } from '@/job/infra/repository/mongo/job-ad.repository';
import { FindJobInputDto } from './find.job.dto';

@Injectable()
export class FindJobUseCase implements UseCaseInterface {
	constructor(
		@Inject(JobAdMongoRepository)
		private readonly repository: JobAdMongoRepository,
	) {}

	async execute(input: FindJobInputDto): Promise<any> {
		const jobAd = await this.repository.getJob(input);
		return jobAd;
	}
}
