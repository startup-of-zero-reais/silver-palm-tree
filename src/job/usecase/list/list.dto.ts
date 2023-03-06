import {
	Exclude,
	Expose,
	plainToClass,
	Transform,
	TransformFnParams,
	Type,
} from 'class-transformer';
import {
	ArrayNotEmpty,
	IsEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { TruncateAfter } from '@/@shared/decorator';
import {
	GreatherThanOrEqual,
	LessThanOrEqual,
} from '@/@shared/decorator/lte-gte.decorator';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import { Meta, ToMeta } from '@/@shared/repository/presenter/meta.dto';
import { Status } from '@/job/domain/entity/job.entity';
import { Filters } from '@/job/domain/filters/filters';

export class ListJobsInputDTO implements Filters {
	// PAGINATION
	@Type(() => Number)
	@IsNumber()
	@Transform(({ value }) => (value <= 0 ? 1 : value))
	page = 1;

	@Type(() => Number)
	@IsNumber()
	@Transform(offset)
	per_page = 30;

	// SEARCH
	@IsOptional()
	@IsString()
	@Transform(({ value }) => decodeURIComponent(value))
	search?: string;

	@IsEmpty()
	@Transform(({ value }) => decodeURIComponent(value).split(','))
	status?: Status[];

	// FILTER
	@IsOptional()
	@Transform(({ value }) => value.split(','))
	@ArrayNotEmpty()
	contracts?: string[];

	@IsOptional()
	@Transform(({ value }) => value.split(','))
	@ArrayNotEmpty()
	techs?: string[];

	@IsOptional()
	@LessThanOrEqual('maxSalary')
	@Type(() => Number)
	minSalary?: number;

	@IsOptional()
	@GreatherThanOrEqual('minSalary')
	@Type(() => Number)
	maxSalary?: number;

	@IsOptional()
	availability?: string;

	@IsOptional()
	@Transform(({ value }) => decodeURIComponent(value))
	location?: string;

	@IsEmpty()
	recruiter?: string;
}

@Exclude()
export class ListJobsOutputDTO {
	@Expose()
	@Transform(({ obj }) => itemToData(obj))
	data: JobOutputDTO[] = [];

	@Expose()
	@ToMeta()
	meta: Meta;
}

@Exclude()
export class JobCompanyOutputDTO {
	@Expose({ name: '_id' }) id: string;
	@Expose() cnpj: string;
	@Expose() logo: string;
	@Expose() description: string;
}

@Exclude()
export class JobOutputDTO {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	@TruncateAfter(250)
	description: string;

	@Expose()
	@Transform(({ obj }) => obj.salaryStr)
	salary: string;

	@Expose()
	@Type(() => JobCompanyOutputDTO)
	company: JobCompanyOutputDTO;

	@Expose()
	contracts?: string[];

	@Expose()
	techs?: string[];

	@Expose()
	availability?: string;

	@Expose()
	location?: string;

	@Expose()
	status?: Status;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	@Expose()
	@Transform(applyHref)
	_links: any;
}

function itemToData(pagination: PaginationInterface<any>) {
	return pagination.items().map((item) => plainToClass(JobOutputDTO, item));
}

function applyHref({ obj }: TransformFnParams) {
	return {
		self: { href: `${process.env.BASE_URL}/companies/${obj.id}` },
		company: {
			href: `${process.env.BASE_URL}/companies/${obj.company.id}`,
		},
	};
}

function offset(params: TransformFnParams) {
	if (params.value < 0) return 1;
	// enable if per_page = 0 no apply offset
	if (params.value == 0 || params.value > 1000) return 1000;

	return params.value;
}
