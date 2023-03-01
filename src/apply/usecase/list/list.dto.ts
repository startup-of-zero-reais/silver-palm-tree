import {
	Exclude,
	Expose,
	Transform,
	TransformFnParams,
	Type,
} from 'class-transformer';
import { Meta, ToMeta } from '@/@shared/repository/presenter/meta.dto';
import { Status as JobStatus } from '@/job/domain/entity/job.entity';

@Exclude()
export class ApplyJobCompanyOutputDTO {
	@Expose()
	id: string;

	@Expose()
	logo: string;

	@Expose()
	cnpj: string;

	@Expose()
	description: string;
}

@Exclude()
export class ApplyJobOutputDTO {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	description: string;

	@Expose()
	status: JobStatus;

	@Expose()
	@Type(() => ApplyJobCompanyOutputDTO)
	company: ApplyJobCompanyOutputDTO;

	@Expose()
	contracts: string[];

	@Expose()
	techs: string[];

	@Expose()
	availability: string;

	@Expose()
	location: string;
}

@Exclude()
export class ApplyOutputDTO {
	@Expose()
	@Type(() => ApplyJobOutputDTO)
	job: ApplyJobOutputDTO;

	@Expose()
	createdAt: Date;

	@Expose()
	@Transform(applyHref)
	_links: Record<string, { href: string }>;
}

@Exclude()
export class ListAppliesOutputDTO {
	@Expose({ name: '_items' })
	@Type(() => ApplyOutputDTO)
	data: ApplyOutputDTO[];

	@Expose()
	@ToMeta()
	meta: Meta;
}

function applyHref(params: TransformFnParams) {
	const { obj: apply } = params;

	return {
		job: { href: `${process.env.BASE_URL}/jobs/${apply.job.id}` },
		company: {
			href: `${process.env.BASE_URL}/companies/${apply.job.company.id}`,
		},
	};
}
