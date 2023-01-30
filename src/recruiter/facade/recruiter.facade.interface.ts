import { Recruiter } from '../domain';

export default interface RecruiterFacadeInterface {
	getByID(id: string): Promise<Recruiter>;
	getByEmail(email: string): Promise<Recruiter>;
}
