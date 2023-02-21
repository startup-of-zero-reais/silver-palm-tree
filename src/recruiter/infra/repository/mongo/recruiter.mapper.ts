import { ObjectTransformer } from '@/@shared/helpers';
import { Recruiter } from '@/recruiter/domain';
import { Recruiter as RecruiterEntity } from './recruiter.model';

export class RecruiterMapper {
	static domainToOrm(recruiter: Recruiter): RecruiterEntity {
		return ObjectTransformer.transform<Recruiter, RecruiterEntity>(
			recruiter,
		)
			.property('id')
			.to('_id')
			.property('name')
			.to('name')
			.property('email')
			.to('email')
			.property('password')
			.to('password')
			.property('status')
			.to('status')
			.property('image')
			.to('image')
			.transformed();
	}
}
