import { FilterQuery, PipelineStage } from 'mongoose';
import { Status } from '@/company/domain/entity/company.entity';
import { JobAdViewDocument } from './job-ad.model';

export function aggregateCompany(
	filterQuery: FilterQuery<JobAdViewDocument>,
	withSearch = false,
	page = 1,
	per_page = 30,
): PipelineStage[] {
	const score = () => {
		return withSearch ? { score: { $meta: 'textScore' } } : {};
	};

	const skip = () => {
		if (page > 1) {
			return per_page * (page - 1);
		}

		return 0;
	};

	return [
		{ $match: filterQuery },
		{
			$lookup: {
				from: 'companies',
				as: 'companies',
				localField: 'company._id',
				foreignField: '_id',
			},
		},
		{ $match: { 'companies.status': Status.ACTIVATED } },
		{ $project: { company: 0 } },
		{
			$replaceRoot: {
				newRoot: {
					$mergeObjects: [
						{
							company: {
								$arrayElemAt: ['$companies', 0],
							},
						},
						'$$ROOT',
					],
				},
			},
		},
		{
			$project: {
				companies: 0,
				...score(),
			},
		},
		{ $skip: skip() },
		{ $limit: per_page },
	];
}
