import { Event } from '@/job/domain/events/event';
import { JobAdMapper } from './job-ad.mapper';
import { Event as DbEvent } from './job-ad.model';

export class EventMapper {
	static toDomain(schemaEvent: DbEvent): Event {
		const event = new Event(
			schemaEvent.action,
			schemaEvent.data,
			schemaEvent.createdAt,
			schemaEvent.__v,
		);

		return event;
	}

	static toEvent(event: Event): DbEvent {
		const dbEvent = new DbEvent();
		dbEvent.action = event.action();
		dbEvent.data = JobAdMapper.toData(event.data());
		dbEvent.createdAt = event.createdAt ?? new Date();

		return dbEvent;
	}
}
