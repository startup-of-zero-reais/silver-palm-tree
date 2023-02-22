import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import {
	JobAdView,
	JobAdViewDocument,
} from '@/job/infra/repository/mongo/job-ad.model';

@Injectable()
export class ListUseCase implements UseCaseInterface {
	constructor(
		@InjectModel(JobAdView.name)
		private readonly jobView: Model<JobAdViewDocument>,
	) {}

	async execute(): Promise<any> {
		const result = await this.jobView.aggregate([
			{ $group: { _id: '$location' } },
			{ $match: { _id: { $ne: null } } },
			{ $replaceRoot: { newRoot: { name: '$_id' } } },
		]);

		return result;
	}
}
