import { Location } from '@/locations/domain/location.entity';
import JobAd, { Status } from '../entity/job.entity';
import { Event } from './event';

type Props = {
	id?: string;
	title: string;
	description: string;
	salary: number;
	hideSalary?: boolean;
	owner: string;
	companyID: string;
	contracts?: string[];
	techs?: string[];
	availability: string;
	location?: string;
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
				company: { _id: props.companyID } as any,
				status: Status.INSPECTION,
				contracts: props.contracts ?? [],
				techs: props.techs ?? [],
				availability: props.availability,
				location: props.location,
			}),
		);
	}
}
