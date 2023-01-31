import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsUrl } from 'class-validator';

export class UpdateCompanyInputDto {
	@IsOptional()
	id: string;

	@IsOptional()
	description?: string;

	@IsUrl()
	@IsOptional()
	logo?: string;
}

@Exclude()
export class UpdateCompanyOutputDto {
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
