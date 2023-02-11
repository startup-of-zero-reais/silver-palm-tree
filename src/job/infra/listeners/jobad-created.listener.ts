import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JobAdCreatedEvent } from '@/job/domain/events/job-ad.created.event';
import { JobAdMongoRepository } from '../repository/mongo/job-ad.repository';

@Injectable()
export class JobAdCreatedListener {
	constructor(
		@Inject(JobAdMongoRepository)
		private readonly repository: JobAdMongoRepository,
	) {}

	@OnEvent(JobAdCreatedEvent.action)
	async handleJobAdCreatedEvent(event: JobAdCreatedEvent) {
		await this.repository.putEvent(event);
	}
}
