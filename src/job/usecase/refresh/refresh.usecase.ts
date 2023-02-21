import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isAfter, parseISO, addMinutes, isBefore } from 'date-fns';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { JobAdRefreshedEvent } from '@/job/domain/events/job-ad.refreshed.event';
import { JobAdMongoRepository } from '@/job/infra/repository/mongo/job-ad.repository';
import { RefreshJobInputDTO } from './refresh.dto';

@Injectable()
export class RefreshJobUseCase implements UseCaseInterface {
	constructor(
		private readonly repository: JobAdMongoRepository,
		private readonly dispatcher: EventEmitter2,
	) {}

	async execute(input: RefreshJobInputDTO): Promise<any> {
		const job = await this.repository.getJob({ id: input.id });

		if (![job.owner, ...job.editors].includes(input.requirer)) {
			throw new HttpErrorException(
				'You have no permissions to do that',
				422,
			);
		}

		const interval = addMinutes(job.updatedAt, 5);
		if (isBefore(Date.now(), interval)) {
			throw new HttpErrorException(
				'Refresh to this job already requested',
				400,
			);
		}

		const event = new JobAdRefreshedEvent(input);

		this.dispatcher.emit(JobAdRefreshedEvent.action, event);

		return { refresh: 'requested' };
	}
}
