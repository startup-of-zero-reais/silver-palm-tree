import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { Status } from '@/job/domain/entity/job.entity';
import { JobAdActivatedEvent } from '@/job/domain/events/job-ad.activated.event';
import { UpdateJobStatusInputDto } from './update-job-status.dto';

@Injectable()
export class UpdateJobStatusUseCase implements UseCaseInterface {
	constructor(private readonly dispatcher: EventEmitter2) {}

	async execute(input: UpdateJobStatusInputDto): Promise<void> {
		let event: JobAdActivatedEvent;
		if (input.status === Status.ACTIVATED) {
			event = new JobAdActivatedEvent({
				id: input.id,
				editor: input.editor,
				status: Status.ACTIVATED,
			});
		}

		if (typeof event !== 'undefined')
			await this.dispatcher.emitAsync(event.action(), event);
	}
}
