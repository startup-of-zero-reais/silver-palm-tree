import { FilterQuery, PipelineStage } from 'mongoose';
import { Status } from '@/company/domain/entity/company.entity';
import { JobAdViewDocument } from './job-ad.model';

export function aggregateCompany(
	filterQuery: FilterQuery<JobAdViewDocument>,
	withSearch = false,
): PipelineStage[] {
	const score = () => {
		return withSearch ? { score: { $meta: 'textScore' } } : {};
	};

	return [
		{ $match: filterQuery },
		{
			$lookup: {
				from: 'companies',
				as: 'companies',
				localField: 'companyID',
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
	];
}
