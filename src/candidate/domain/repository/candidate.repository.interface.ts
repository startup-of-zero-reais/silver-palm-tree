import Repository from 'src/@shared/repository/repository-interface';
import Candidate from '../entity/candidate.entity';

export type CandidateRepositoryInterface = Repository<Candidate> & {
	findByEmail: (email: string) => Promise<Candidate>;
};
