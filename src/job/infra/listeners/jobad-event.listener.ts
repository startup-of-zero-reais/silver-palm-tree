import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JobAdActivatedEvent } from '@/job/domain/events/job-ad.activated.event';
import { JobAdCreatedEvent } from '@/job/domain/events/job-ad.created.event';
import { JobAdRefreshedEvent } from '@/job/domain/events/job-ad.refreshed.event';
import { JobAdMongoRepository } from '../repository/mongo/job-ad.repository';

@Injectable()
export class JobAdEventListener {
	constructor(
		@Inject(JobAdMongoRepository)
		private readonly repository: JobAdMongoRepository,
	) {}

	@OnEvent(JobAdCreatedEvent.action)
	@OnEvent(JobAdActivatedEvent.action)
	@OnEvent(JobAdRefreshedEvent.action)
	async handleJobAdCreatedEvent(
		event: JobAdCreatedEvent | JobAdActivatedEvent | JobAdRefreshedEvent,
	) {
		console.log(event.action());
		await this.repository.putEvent(event);
	}
}
