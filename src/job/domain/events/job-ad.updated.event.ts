import JobAd, { Status } from '../entity/job.entity';
import { Event } from './event';

export interface UpdateJobEventProps {
	// Required identification props
	id: string;
	editor: string;
	// Update props
	title?: string;
	salary?: number;
	hideSalary?: boolean;
	description?: string;
	contracts?: string[];
	techs?: string[];
	availability?: string;
}

export class JobAdUpdatedEvent extends Event {
	static action = 'jobad.updated';

	constructor(props: UpdateJobEventProps) {
		const { editor, ...input } = props;

		super(
			JobAdUpdatedEvent.action,
			new JobAd({
				...input,
				status: Status.RE_INSPECTION,
				editors: [editor],
			}),
		);
	}
}
