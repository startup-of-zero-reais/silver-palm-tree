import JobAd, { Status } from '../entity/job.entity';
import { Event } from './event';

type Props = {
	id: string;
	status: Status;
	editor: string;
};

export class JobAdActivatedEvent extends Event {
	static action = 'jobad.activated';

	constructor(props: Props) {
		super(
			JobAdActivatedEvent.action,
			new JobAd({
				id: props.id,
				status: props.status,
				editors: [props.editor],
			}),
		);
	}
}
