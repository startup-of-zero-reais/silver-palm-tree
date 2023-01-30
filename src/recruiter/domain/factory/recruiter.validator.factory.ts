import ValidatorInterface from '@/@shared/validator/ValidatorInterface';
import Recruiter from '../entity/recruiter.entity';
import RecruiterYupValidator from '../validator/recruiter.validator';

export default class RecruiterValidatorFactory {
  static create(): ValidatorInterface<Recruiter> {
    return new RecruiterYupValidator();
  }
}
