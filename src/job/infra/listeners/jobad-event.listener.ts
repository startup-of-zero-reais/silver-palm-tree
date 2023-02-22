import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JobAdActivatedEvent } from '@/job/domain/events/job-ad.activated.event';
import { JobAdBlockedEvent } from '@/job/domain/events/job-ad.blocked.event';
import { JobAdCreatedEvent } from '@/job/domain/events/job-ad.created.event';
import { JobAdDeactivatedEvent } from '@/job/domain/events/job-ad.deactivated.event';
import { JobAdRefreshedEvent } from '@/job/domain/events/job-ad.refreshed.event';
import { JobAdUpdatedEvent } from '@/job/domain/events/job-ad.updated.event';
import { JobAdMongoRepository } from '../repository/mongo/job-ad.repository';

@Injectable()
export class JobAdEventListener {
	constructor(
		@Inject(JobAdMongoRepository)
		private readonly repository: JobAdMongoRepository,
	) {}

	@OnEvent(JobAdCreatedEvent.action)
	@OnEvent(JobAdActivatedEvent.action)
	@OnEvent(JobAdDeactivatedEvent.action)
	@OnEvent(JobAdBlockedEvent.action)
	@OnEvent(JobAdRefreshedEvent.action)
	@OnEvent(JobAdUpdatedEvent.action)
	async handleJobAdCreatedEvent(
		event:
			| JobAdCreatedEvent
			| JobAdActivatedEvent
			| JobAdRefreshedEvent
			| JobAdDeactivatedEvent
			| JobAdBlockedEvent
			| JobAdUpdatedEvent,
	) {
		await this.repository.putEvent(event);
	}
}
