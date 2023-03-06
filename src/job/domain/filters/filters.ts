import { Status } from '../entity/job.entity';

export interface Filters {
	contracts?: string[];
	techs?: string[];
	minSalary?: number;
	maxSalary?: number;
	availability?: string;
	location?: string;
	status?: Status[];
	// owner / editor filters
	recruiter?: string;
}
