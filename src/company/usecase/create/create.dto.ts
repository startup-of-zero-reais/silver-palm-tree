import { Exclude, Expose } from 'class-transformer';
import { IsEmpty, IsNotEmpty, IsUrl } from 'class-validator';
import { IsCNPJ } from '@/@shared/decorator/cnpj.decorator';

export class CreateCompanyInputDto {
	@IsEmpty()
	id?: string;

	@IsNotEmpty()
	@IsUrl()
	logo: string;

	@IsNotEmpty()
	@IsCNPJ()
	cnpj: string;

	@IsNotEmpty()
	description: string;

	@IsEmpty()
	admin: string;
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

	@Expose()
	status: string;
}
