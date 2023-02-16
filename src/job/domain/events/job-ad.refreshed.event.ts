import JobAd from '../entity/job.entity';
import { Event } from './event';

type Props = {
	id: string;
	requirer: string;
};

export class JobAdRefreshedEvent extends Event {
	static action = 'jobad.refreshed';

	constructor(props: Props) {
		super(
			JobAdRefreshedEvent.action,
			new JobAd({
				id: props.id,
				editors: [props.requirer],
			}),
		);
	}
}
