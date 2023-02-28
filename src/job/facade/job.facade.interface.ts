import JobAd from '../domain/entity/job.entity';

export default interface JobFacadeInterface {
	getJobByID(id: string): Promise<JobAd>;
}
