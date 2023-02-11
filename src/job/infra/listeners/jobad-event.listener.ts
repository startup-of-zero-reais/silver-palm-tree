import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JobAdActivatedEvent } from '@/job/domain/events/job-ad.activated.event';
import { JobAdCreatedEvent } from '@/job/domain/events/job-ad.created.event';
import { JobAdMongoRepository } from '../repository/mongo/job-ad.repository';

@Injectable()
export class JobAdEventListener {
	constructor(
		@Inject(JobAdMongoRepository)
		private readonly repository: JobAdMongoRepository,
	) {}

	@OnEvent(JobAdCreatedEvent.action)
	@OnEvent(JobAdActivatedEvent.action)
	async handleJobAdCreatedEvent(
		event: JobAdCreatedEvent | JobAdActivatedEvent,
	) {
		console.log(event.action());
		await this.repository.putEvent(event);
	}
}
