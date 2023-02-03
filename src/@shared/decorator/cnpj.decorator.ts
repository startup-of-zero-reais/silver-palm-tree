import {
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { validatorCNPJ } from '../helper/validator.cnpj';

@ValidatorConstraint({ name: 'validateCNPJ', async: false })
export class ValidateCNPJ implements ValidatorConstraintInterface {
	validate(value: string): boolean | Promise<boolean> {
		return validatorCNPJ(value);
	}

	defaultMessage(validationArguments?: ValidationArguments): string {
		return `${validationArguments.property} is invalid`;
	}
}

export function IsCNPJ() {
	return Validate(ValidateCNPJ);
}
