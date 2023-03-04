import ValidatorInterface from 'src/@shared/validator/ValidatorInterface';
import * as yup from 'yup';
import Candidate from '../entity/candidate.entity';

export default class CandidateYupValidator
	implements ValidatorInterface<Candidate>
{
	validate(entity: Candidate): void {
		try {
			yup.object()
				.shape({
					name: yup.string().min(2).max(255).required(),
					email: yup.string().email().required(),
					image: yup.string().url().required(),
					phone: yup.string().required(),
				})
				.validateSync(
					{
						name: entity.name,
						email: entity.email,
						image: entity.image,
						phone: entity.phone,
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
