import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Apply } from '@/apply/domain/apply.entity';
import { ApplyMapper } from './apply.mapper';
import { Apply as ApplyEntity, ApplyDocument } from './apply.model';

@Injectable()
export class ApplyMongoRepository {
	constructor(
		@InjectModel(ApplyEntity.name)
		private readonly repository: Model<ApplyDocument>,
	) {}

	async apply(apply: Apply) {
		await this.repository.create(ApplyMapper.toMongo(apply));
		return apply;
	}

	async findByJob(jobID: string) {
		return ApplyMapper.toDomain(
			await this.repository.findOne({ jobID }).exec(),
		);
	}

	async findByCandidate(candidateID: string) {
		return ApplyMapper.toDomain(
			await this.repository.findOne({ candidateID }).exec(),
		);
	}

	async findApply(apply: Apply) {
		const entity = ApplyMapper.toMongo(apply);

		const result = await this.repository.findOne({
			jobID: entity.jobID,
			candidateID: entity.candidateID,
		});

		if (!result) return null;

		return ApplyMapper.toDomain(result);
	}
}
