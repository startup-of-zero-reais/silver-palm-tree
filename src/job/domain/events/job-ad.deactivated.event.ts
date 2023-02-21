import JobAd, { Status } from '../entity/job.entity';
import { Event } from './event';
import { Props } from './job-ad.activated.event';

export class JobAdDeactivatedEvent extends Event {
	static action = 'jobad.deactivated';

	constructor(props: Props) {
		super(
			JobAdDeactivatedEvent.action,
			new JobAd({
				id: props.id,
				status: Status.DEACTIVATED,
				editors: [props.editor],
			}),
		);
	}
}
