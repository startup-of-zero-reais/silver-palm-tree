import Candidate from '../domain/entity/candidate.entity';

export default interface CandidateFacadeInterface {
	getByID(id: string): Promise<Candidate>;
	getByEmail(email: string): Promise<Candidate>;
}
