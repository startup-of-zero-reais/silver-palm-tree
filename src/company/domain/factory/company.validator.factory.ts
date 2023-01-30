import ValidatorInterface from '@/@shared/validator/ValidatorInterface';
import Company from '../entity/company.entity';
import CompanyYupValidator from '../validator/company.validator';

export default class CompanyValidatorFactory {
	static create(): ValidatorInterface<Company> {
		return new CompanyYupValidator();
	}
}
