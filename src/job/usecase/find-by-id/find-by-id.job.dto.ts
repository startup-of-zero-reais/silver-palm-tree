import {
	Exclude,
	Expose,
	Transform,
	TransformFnParams,
	Type,
} from 'class-transformer';
import { IsUUID } from 'class-validator';
import Company from '@/company/domain/entity/company.entity';
import { Status } from '@/job/domain/entity/job.entity';

export class FindJobByIDInputDto {
	@IsUUID()
	id: string;
}

@Exclude()
export class FindJobByIDCompanyOutputDTO {
	@Expose()
	@Transform(({ obj }) => obj._id)
	id: string;

	@Expose()
	cnpj: string;

	@Expose()
	logo: string;

	@Expose()
	description: string;
}

@Exclude()
export class FindJobByIDOutputDto {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	description: string;

	@Expose()
	@Transform(({ obj }) => obj.salaryStr)
	salary: string;

	@Expose()
	@Type(() => FindJobByIDCompanyOutputDTO)
	company: Company;

	// @Expose()
	status: Status;

	@Expose()
	owner: string;

	@Expose()
	editors: string[];

	@Expose()
	contracts?: string[];

	@Expose()
	techs?: string[];

	@Expose()
	availability: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	@Expose()
	@Transform(applyHref)
	_links: any;
}

function applyHref({ obj }: TransformFnParams) {
	return {
		self: { href: `${process.env.BASE_URL}/jobs/${obj.id}` },
		company: {
			href: `${process.env.BASE_URL}/companies/${obj.company._id}`,
		},
	};
}
