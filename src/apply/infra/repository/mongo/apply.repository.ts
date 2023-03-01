import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PaginationPresenter from '@/@shared/repository/presenter/pagination.presenter';
import { Apply } from '@/apply/domain/apply.entity';
import { Filters } from '@/apply/domain/filters/filters.interface';
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

	async findByJob(jobID: string, page = 1, per_page = 30) {
		return this.paginate(page, per_page, { jobID });
	}

	async findByCandidate(candidateID: string, page = 1, per_page = 30) {
		return this.paginate(page, per_page, { candidateID });
	}

	private async paginate(page = 1, per_page = 30, filters: Filters = {}) {
		const [total, applies] = await Promise.all([
			this.repository.find(filters).countDocuments(),
			this.repository
				.find(filters)
				.populate({ path: 'job', populate: 'company' })
				.populate('candidate', { password: 0 })
				.sort({ createdAt: -1 })
				.exec(),
		]);

		return new PaginationPresenter(
			ApplyMapper.arrayToDomain(applies),
			total,
			per_page,
			page,
		);
	}

	async findApply(apply: Apply) {
		const entity = ApplyMapper.toMongo(apply);

		const result = await this.repository.findOne({
			jobID: entity.job._id,
			candidateID: entity.candidate._id,
		});

		if (!result) return null;

		return ApplyMapper.toDomain(result);
	}
}
