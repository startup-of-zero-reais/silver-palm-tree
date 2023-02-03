import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRecruiterInputDto {
	@IsNotEmpty()
	@IsOptional()
	id: string;

	@IsNotEmpty()
	@IsOptional()
	name: string;

	@IsNotEmpty()
	@IsOptional()
	image: string;
}

@Exclude()
export class CompanyOutputDto {
	@Expose()
	id: string;

	@Expose()
	cnpj: string;
}

@Exclude()
export class UpdateRecruiterOutputDto {
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

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}
