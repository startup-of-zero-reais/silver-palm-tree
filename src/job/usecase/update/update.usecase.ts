import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { Status } from '@/job/domain/entity/job.entity';
import { JobAdUpdatedEvent } from '@/job/domain/events/job-ad.updated.event';
import { JobAdMongoRepository } from '@/job/infra/repository/mongo/job-ad.repository';
import { UpdateInputDTO } from './update.dto';

@Injectable()
export class UpdateUseCase implements UseCaseInterface {
	constructor(
		private readonly repository: JobAdMongoRepository,
		private readonly dispatcher: EventEmitter2,
	) {}

	async execute(input: UpdateInputDTO): Promise<any> {
		const job = await this.repository.getJob({ id: input.id });

		if (![job.owner, ...job.editors].includes(input.editor)) {
			throw new HttpErrorException('You can not update that job ad', 403);
		}

		if ([Status.BLOCKED, Status.EXPIRED].includes(job.status)) {
			throw new HttpErrorException(
				`A job who is ${job.status.toLowerCase()} can not be updated`,
				403,
			);
		}

		const event = new JobAdUpdatedEvent(input);
		this.dispatcher.emit(event.action(), event);
	}
}
