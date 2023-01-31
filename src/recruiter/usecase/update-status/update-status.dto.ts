import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Status } from '@/recruiter/domain';

export class UpdateStatusRecruiterInputDto {
	@IsNotEmpty()
	@IsOptional()
	id: string;

	@IsNotEmpty()
	@IsOptional()
	@IsEnum(Status)
	status: Status;
}

@Exclude()
export class CompanyOutputDto {
	@Expose()
	id: string;

	@Expose()
	cnpj: string;
}

@Exclude()
export class UpdateStatusRecruiterOutputDto {
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
