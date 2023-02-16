import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { JobAdRefreshedEvent } from '@/job/domain/events/job-ad.refreshed.event';
import { RefreshJobInputDTO } from './refresh.dto';

@Injectable()
export class RefreshJobUseCase implements UseCaseInterface {
	constructor(private readonly dispatcher: EventEmitter2) {}

	async execute(input: RefreshJobInputDTO): Promise<any> {
		const event = new JobAdRefreshedEvent(input);

		this.dispatcher.emit(JobAdRefreshedEvent.action, event);

		return { refresh: 'requested' };
	}
}
