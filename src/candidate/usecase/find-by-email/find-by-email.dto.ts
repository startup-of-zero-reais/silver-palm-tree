import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindByEmailInputDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;
}
