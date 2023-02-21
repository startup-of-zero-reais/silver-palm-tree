import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { Status } from '@/job/domain/entity/job.entity';
import { JobAdActivatedEvent } from '@/job/domain/events/job-ad.activated.event';
import { JobAdBlockedEvent } from '@/job/domain/events/job-ad.blocked.event';
import { JobAdDeactivatedEvent } from '@/job/domain/events/job-ad.deactivated.event';
import { JobAdExpiredEvent } from '@/job/domain/events/job-ad.expired.event';
import { UpdateJobStatusInputDto } from './update-job-status.dto';

@Injectable()
export class UpdateJobStatusUseCase implements UseCaseInterface {
	constructor(private readonly dispatcher: EventEmitter2) {}

	async execute(input: UpdateJobStatusInputDto): Promise<void> {
		let event:
			| JobAdActivatedEvent
			| JobAdDeactivatedEvent
			| JobAdExpiredEvent
			| JobAdBlockedEvent;

		if (input.status === Status.ACTIVATED) {
			event = new JobAdActivatedEvent(input);
		} else if (input.status === Status.DEACTIVATED) {
			event = new JobAdDeactivatedEvent(input);
		} else if (input.status === Status.EXPIRED) {
			event = new JobAdExpiredEvent(input);
		} else if (input.status === Status.BLOCKED) {
			event = new JobAdBlockedEvent(input);
		}

		if (typeof event !== 'undefined')
			this.dispatcher.emit(event.action(), event);
	}
}
