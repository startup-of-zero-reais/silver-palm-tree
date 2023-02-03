import { Candidate, Props as NewCandidateProps } from '@/candidate/domain';
import { Recruiter, Props as NewRecruiterProps } from '@/recruiter/domain';

type CandidateProps = NewCandidateProps & { type: 'candidate' };
type RecruiterProps = NewRecruiterProps & { type: 'recruiter' };

type Props<Parent> = Parent extends Candidate
	? CandidateProps
	: Parent extends Recruiter
	? RecruiterProps
	: never;

export class User {
	static getInstance<K = Candidate | Recruiter>(props: Props<K>): K {
		if (props.type === 'candidate') {
			return new Candidate(props) as K;
		}

		if (props.type === 'recruiter') {
			return new Recruiter(props) as K;
		}

		return undefined;
	}
}
