import { Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { ApplyMongoRepository } from '@/apply/infra/repository/mongo/apply.repository';
import { FindByJobIdInputDto } from './find-by-job-id.dto';

@Injectable()
export class FindByJobIdUseCase implements UseCaseInterface {
	constructor(private readonly repository: ApplyMongoRepository) {}

	async execute(input: FindByJobIdInputDto): Promise<any> {
		const applies = await this.repository.findByJob(input.jobId);

		if (!applies) throw new HttpErrorException('job not found', 404);

		return applies.items();
	}
}
