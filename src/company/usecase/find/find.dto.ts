import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class FindCompanyInputDto {
	@IsNotEmpty()
	id: string;
}

@Exclude()
export class FindCompanyOutputDto {
	@Expose()
	id: string;

	@Expose()
	logo: string;

	@Expose()
	cnpj: string;

	@Expose()
	description: string;

	@Expose({ until: 1 })
	status: string;
}
