import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';

export class FindRecruiterInputDto {
	id: string;
}

@Exclude()
export class CompanyOutputDto {
	@Expose()
	id: string;

	@Expose()
	cnpj: string;
}

@Exclude()
export class FindRecruiterOutputDto {
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
