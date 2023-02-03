import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class FindByCNPJCompanyInputDto {
	@IsNotEmpty()
	cnpj: string;
}

@Exclude()
export class FindByCNPJCompanyOutputDto {
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
