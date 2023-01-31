import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsUrl,
	Length,
} from 'class-validator';

@Exclude()
export class CompanyOutputDto {
	@Expose()
	id: string;

	@Expose()
	cnpj: string;
}

class CompanyInputDto {
	@IsOptional()
	logo: string;
	@IsOptional()
	description: string;
	@IsOptional()
	cnpj: string;
}

export class CreateInputDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsUrl()
	@IsOptional()
	image: string;

	@IsNotEmpty()
	@Length(6, 64)
	password: string;

	@IsOptional()
	company?: CompanyInputDto;
}

@Exclude()
export class CreateOutputDto {
	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	email: string;

	@Expose()
	status: string;

	@Expose()
	@Transform(({ obj }) =>
		plainToClass(CompanyOutputDto, {
			id: obj.companyID,
			cnpj: obj.companyCNPJ,
		}),
	)
	company: CompanyOutputDto;
}
