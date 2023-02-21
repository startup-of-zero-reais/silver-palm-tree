import JobAd, { Status } from '../entity/job.entity';
import { Event } from './event';
import { Props } from './job-ad.activated.event';

export class JobAdBlockedEvent extends Event {
	static action = 'jobad.blocked';

	constructor(props: Props) {
		super(
			JobAdBlockedEvent.action,
			new JobAd({
				id: props.id,
				status: Status.BLOCKED,
				editors: [props.editor],
			}),
		);
	}
}
