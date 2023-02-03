import Repository from '@/@shared/repository/repository-interface';
import Recruiter from '../entity/recruiter.entity';

export type RecruiterRepositoryInterface = Repository<Recruiter> & {
	findByEmail: (email: string) => Promise<Recruiter>;
};
