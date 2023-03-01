import { ObjectTransformer } from '@/@shared/helpers';
import { Candidate, Props } from '@/candidate/domain';
import { Candidate as CandidateEntity } from './candidate.model';

export class CandidateMapper {
	static toDomain(mongo: CandidateEntity): Candidate {
		const props = ObjectTransformer.transform<CandidateEntity, Props>(mongo)
			.property('_id')
			.to('id')
			.property('name')
			.to('name')
			.property('email')
			.to('email')
			.property('image')
			.to('image')
			.property('phone')
			.to('phone')
			.property('password')
			.to('password')
			.property('professionalExperiences')
			.to('professionalExperiences')
			.property('techs')
			.to('techs')
			.transformed();

		return new Candidate(props);
	}
}
