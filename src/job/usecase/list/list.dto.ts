import {
	Exclude,
	Expose,
	plainToClass,
	Transform,
	Type,
} from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { TruncateAfter } from '@/@shared/decorator';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import Company from '@/company/domain/entity/company.entity';

export class ListJobsInputDTO {
	@Type(() => Number)
	@IsNumber()
	page = 1;
	@Type(() => Number)
	@IsNumber()
	per_page = 30;

	@IsOptional()
	@IsString()
	search?: string;
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
	@Transform(({ obj }) => ({
		href: `${process.env.BASE_URL}/jobs/${obj.id}`,
	}))
	self: any;

	@Expose()
	@Transform(({ obj }) => ({
		href: `${process.env.BASE_URL}/companies/${obj.company._id}`,
	}))
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
	@TruncateAfter(140)
	description: string;
	@Expose()
	@Transform(({ obj }) => obj.salaryStr)
	salary: string;
	@Expose()
	@Transform(({ obj }) => plainToClass(JobCompanyOutputDTO, obj.company))
	company: JobCompanyOutputDTO;
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
