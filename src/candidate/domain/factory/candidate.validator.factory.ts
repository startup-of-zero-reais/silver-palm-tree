import ValidatorInterface from '../../../@shared/validator/ValidatorInterface';
import Candidate from '../entity/candidate.entity';
import CandidateYupValidator from '../validator/candidate.validator.factory';

export default class CandidateValidatorFactory {
	static create(): ValidatorInterface<Candidate> {
		return new CandidateYupValidator();
	}
}
