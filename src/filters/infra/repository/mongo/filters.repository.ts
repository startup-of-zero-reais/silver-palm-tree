import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
	JobAdView,
	JobAdViewDocument,
} from '@/job/infra/repository/mongo/job-ad.model';
import { FiltersMapper } from './filters.mapper';

@Injectable()
export class FiltersMongoRepository {
	constructor(
		@InjectModel(JobAdView.name)
		private readonly jobAdView: Model<JobAdViewDocument>,
	) {}

	private async loadByKey(key: string) {
		const varKey = `$${key}`;

		const result = await this.jobAdView.aggregate([
			{ $project: { [key]: 1 } },
			{ $unwind: varKey },
			{ $group: { _id: varKey } },
			{ $match: { _id: { $ne: null } } },
			{ $replaceRoot: { newRoot: { name: '$_id' } } },
			{ $sort: { name: 1 } },
		]);

		return result || [];
	}

	async loadContracts() {
		return FiltersMapper.toContracts(await this.loadByKey('contracts'));
	}

	async loadTechs() {
		return FiltersMapper.toTechs(await this.loadByKey('techs'));
	}

	async loadAvailability() {
		return FiltersMapper.toAvailabilities(
			await this.loadByKey('availability'),
		);
	}
}
