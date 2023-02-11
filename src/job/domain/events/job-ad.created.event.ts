import JobAd, { Status } from '../entity/job.entity';
import { Event } from './event';

type Props = {
	id?: string;
	title: string;
	description: string;
	salary: number;
	hideSalary?: boolean;
	owner: string;
	__v?: number;
};

export class JobAdCreatedEvent extends Event {
	static action = 'jobad.created';

	constructor(props: Props) {
		super(
			JobAdCreatedEvent.action,
			new JobAd({
				title: props.title,
				description: props.description,
				salary: props.salary,
				hideSalary: props.hideSalary ?? false,
				owner: props.owner,
				status: Status.INSPECTION,
			}),
			0,
		);
	}
}
