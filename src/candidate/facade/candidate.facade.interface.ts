import Candidate from '../domain/entity/candidate.entity';

export default interface CandidateFacadeInterface {
  getByEmail(email: string): Promise<Candidate>;
}
