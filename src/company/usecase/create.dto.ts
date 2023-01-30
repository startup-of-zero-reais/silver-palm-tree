import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateCompanyInputDto {
	@IsNotEmpty()
	@IsUrl()
	logo: string;
	@IsNotEmpty()
	cnpj: string;
	@IsNotEmpty()
	description: string;
}

@Exclude()
export class CreateCompanyOutputDto {
	@Expose()
	id: string;

	@Expose()
	logo: string;

	@Expose()
	cnpj: string;

	@Expose()
	description: string;
}
