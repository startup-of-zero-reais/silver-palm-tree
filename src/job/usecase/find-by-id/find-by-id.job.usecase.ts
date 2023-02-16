import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { JobAdMongoRepository } from '@/job/infra/repository/mongo/job-ad.repository';
import { FindJobByIDInputDto } from './find-by-id.job.dto';

@Injectable()
export class FindJobByIDUseCase implements UseCaseInterface {
	constructor(
		@Inject(JobAdMongoRepository)
		private readonly repository: JobAdMongoRepository,
	) {}

	async execute(input: FindJobByIDInputDto): Promise<any> {
		const jobAd = await this.repository.getJob(input);

		if (!jobAd)
			throw new HttpErrorException('Job not found', HttpStatus.NOT_FOUND);

		return jobAd;
	}
}
