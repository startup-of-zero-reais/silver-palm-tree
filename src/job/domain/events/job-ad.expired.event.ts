import JobAd, { Status } from '../entity/job.entity';
import { Event } from './event';
import { Props } from './job-ad.activated.event';

export class JobAdExpiredEvent extends Event {
	static action = 'jobad.expired';

	constructor(props: Props) {
		super(
			JobAdExpiredEvent.action,
			new JobAd({
				id: props.id,
				status: Status.EXPIRED,
				editors: ['SYSTEM'],
			}),
		);
	}
}
