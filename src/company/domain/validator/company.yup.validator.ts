import * as yup from 'yup';
import { validatorCNPJ } from '@/@shared/helper/validator.cnpj';
import ValidatorInterface from '@/@shared/validator/ValidatorInterface';
import Company from '../entity/company.entity';

export class CompanyYupValidator implements ValidatorInterface<Company> {
	validate(entity: Company): void {
		try {
			yup.object()
				.shape({
					cnpj: yup
						.string()
						.test(
							'test-invalid-cnpj',
							'cnpj is invalid',
							(cnpj: string) => {
								return validatorCNPJ(cnpj);
							},
						)
						.required(),
					description: yup.string().required(),
					logo: yup.string().url().required(),
				})
				.validateSync(
					{
						cnpj: entity.cnpj,
						description: entity.description,
						logo: entity.logo,
					},
					{ abortEarly: false },
				);
		} catch (errors) {
			const e = errors as yup.ValidationError;
			e.errors.forEach((error) => {
				entity.notification.addError({ message: error });
			});
		}
	}
}
