import { ObjectTransformer } from '@/@shared/helpers';
import { Apply, State } from '@/apply/domain/apply.entity';
import { Apply as ApplyEntity } from './apply.model';

export class ApplyMapper {
	static toMongo(apply: Apply): ApplyEntity {
		return ObjectTransformer.transform<Apply, ApplyEntity>(apply)
			.property('id')
			.to('_id')
			.property('jobID')
			.to('jobID')
			.property('candidateID')
			.to('candidateID')
			.property('status')
			.to('status')
			.transformed();
	}

	static toDomain(entity: ApplyEntity): Apply {
		const state = ObjectTransformer.transform<ApplyEntity, State>(entity)
			.property('jobID')
			.to('jobID')
			.property('candidateID')
			.to('candidateID')
			.property('status')
			.to('status')
			.transformed();

		return new Apply(state);
	}
}
