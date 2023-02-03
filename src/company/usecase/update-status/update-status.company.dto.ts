import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Status } from '@/recruiter/domain';

export class UpdateStatusCompanyInputDto {
	@IsNotEmpty()
	@IsOptional()
	id: string;

	@IsNotEmpty()
	@IsOptional()
	@IsEnum(Status)
	status: Status;
}

@Exclude()
export class UpdateStatusCompanyOutputDto {
	@Expose()
	id: string;

	@Expose()
	logo: string;

	@Expose()
	cnpj: string;

	@Expose()
	description: string;

	@Expose()
	status: string;

	@Expose()
	createdAt: string;

	@Expose()
	updatedAt: string;
}
