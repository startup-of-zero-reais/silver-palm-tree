import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { JobAdCreatedEvent } from '@/job/domain/events/job-ad.created.event';
import { CreateJobInputDto } from './create.dto';

@Injectable()
export class CreateJobUseCase implements UseCaseInterface {
	constructor(private readonly dispatcher: EventEmitter2) {}

	async execute(input: CreateJobInputDto): Promise<any> {
		const event = new JobAdCreatedEvent({
			title: input.title,
			description: input.description,
			salary: input.salary,
			hideSalary: input.hideSalary,
			owner: input.owner,
			companyID: input.companyID,
		});

		await this.dispatcher.emitAsync(JobAdCreatedEvent.action, event);

		return { id: event.data().id };
	}
}
