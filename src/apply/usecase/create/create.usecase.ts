import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { Apply, Status } from '@/apply/domain/apply.entity';
import { ApplyMongoRepository } from '@/apply/infra/repository/mongo/apply.repository';
import { JobFacade } from '@/job/facade/job.facade';
import JobFacadeInterface from '@/job/facade/job.facade.interface';
import { CreateApplyInputDTO } from './create.dto';

@Injectable()
export class CreateApplyUseCase implements UseCaseInterface {
	constructor(
		private readonly repository: ApplyMongoRepository,

		@Inject(JobFacade)
		private readonly jobFacade: JobFacadeInterface,
	) {}

	async execute(input: CreateApplyInputDTO): Promise<any> {
		const apply = new Apply({
			jobID: input.jobID,
			candidateID: input.candidateID,
			status: Status.FINISHED,
		});

		const [issetApply] = await Promise.all([
			this.repository.findApply(apply),
			this.jobFacade.getJobByID(input.jobID),
		]);

		if (issetApply) {
			throw new HttpErrorException(
				'You already applyied',
				HttpStatus.BAD_REQUEST,
			);
		}

		await this.repository.apply(apply);
	}
}
