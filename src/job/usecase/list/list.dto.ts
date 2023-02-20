import {
	Exclude,
	Expose,
	plainToClass,
	Transform,
	TransformFnParams,
	Type,
} from 'class-transformer';
import { ArrayNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TruncateAfter } from '@/@shared/decorator';
import {
	GreatherThanOrEqual,
	LessThanOrEqual,
} from '@/@shared/decorator/lte-gte.decorator';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import { Filters } from '@/job/domain/filters/filters';

export class ListJobsInputDTO implements Filters {
	// PAGINATION
	@Type(() => Number)
	@IsNumber()
	page = 1;

	@Type(() => Number)
	@IsNumber()
	per_page = 30;

	// SEARCH
	@IsOptional()
	@IsString()
	@Transform(({ value }) => decodeURIComponent(value))
	search?: string;

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
}

@Exclude()
export class Meta {
	@Expose()
	total: number;
	@Expose()
	current_page: number;
	@Expose()
	first_page: number;
	@Expose()
	last_page: number;
	@Expose()
	per_page: number;
}

@Exclude()
export class ListJobsOutputDTO {
	@Expose()
	@Transform(({ obj }) => itemToData(obj))
	data: JobOutputDTO[] = [];
	@Expose()
	@Transform(({ obj }) => parseObjToMeta(obj))
	meta: Meta;
}

@Exclude()
class HalJSON {
	@Expose()
	@Transform(applyHref('jobs', 'id'))
	self: any;

	@Expose()
	@Transform(applyHref('companies', 'company._id'))
	company: any;
}

@Exclude()
export class JobCompanyOutputDTO {
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
	@Transform(({ obj }) => plainToClass(JobCompanyOutputDTO, obj.company))
	company: JobCompanyOutputDTO;

	@Expose()
	contracts?: string[];

	@Expose()
	techs?: string[];

	@Expose()
	availability?: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	@Expose()
	@Transform(({ obj }) => plainToClass(HalJSON, obj))
	_links: HalJSON;
}

function itemToData(pagination: PaginationInterface<any>) {
	return pagination.items().map((item) => plainToClass(JobOutputDTO, item));
}

function parseObjToMeta(pagination: PaginationInterface<any>) {
	return plainToClass(Meta, {
		total: pagination.total(),
		current_page: pagination.currentPage(),
		first_page: pagination.firstPage(),
		last_page: pagination.lastPage(),
		per_page: pagination.perPage(),
	});
}

function applyHref(resource: string, key: string) {
	return function ({ obj }: TransformFnParams) {
		let param = '';
		const keys = key.split('.');

		for (const k of keys) {
			if (!param) param = obj[k];

			if (obj[k]) {
				param = obj[k];
			}
		}

		return {
			href: `${process.env.BASE_URL}/${resource}/${param}`,
		};
	};
}
