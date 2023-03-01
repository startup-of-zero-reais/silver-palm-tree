/* eslint-disable prettier/prettier */
import { ObjectTransformer } from '@/@shared/helpers';
import { Apply, State } from '@/apply/domain/apply.entity';
import { CandidateMapper } from '@/candidate/infra/repository/mongo/candidate.mapper';
import { CompanyMapper } from '@/company/infra/repository/mongo/company.mapper';
import { JobAdMapper } from '@/job/infra/repository/mongo/job-ad.mapper';
import { Apply as ApplyEntity } from './apply.model';

export class ApplyMapper {
	static toMongo(apply: Apply): ApplyEntity {
		return ObjectTransformer.transform<Apply, ApplyEntity>(apply)
			.property('id').to('_id')
			.property('jobID').to('job._id')
			.property('job.id').to('job._id')
			.property('candidateID').to('candidate._id')
			.property('candidate.id').to('candidate._id')
			.property('status').to('status')
			.transformed();
	}

	static toDomain(entity: ApplyEntity): Apply {
		const state = ObjectTransformer.transform<ApplyEntity, State>(entity)
			.property('_id').to('id')
			.property('status').to('status')
			.transformed();

		const job = JobAdMapper.toDomain(entity.job)
		const candidate = CandidateMapper.toDomain(entity.candidate);

		return new Apply(state)
			.attachJob(job)
			.attachCandidate(candidate);
	}

	static arrayToDomain(entities: ApplyEntity[] = []): Apply[] {
		return entities.map(ApplyMapper.toDomain);
	}

	static arrayToMongo(applies: Apply[] = []): ApplyEntity[] {
		return applies.map(ApplyMapper.toMongo);
	}
}
