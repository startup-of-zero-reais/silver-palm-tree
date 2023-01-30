import * as yup from 'yup';
import ValidatorInterface from '@/@shared/validator/ValidatorInterface';
import Recruiter from '../entity/recruiter.entity';

export default class RecruiterYupValidator
  implements ValidatorInterface<Recruiter>
{
  validate(entity: Recruiter): void {
    try {
      yup
        .object()
        .shape({
          name: yup.string().min(2).max(255).required(),
          email: yup.string().email().required(),
          image: yup.string().url().required(),
        })
        .validateSync(
          {
            name: entity.name,
            email: entity.email,
            image: entity.image,
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
