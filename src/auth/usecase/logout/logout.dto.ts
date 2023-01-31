import { IsJWT, IsNotEmpty } from 'class-validator';

export class LogoutInputDto {
	@IsNotEmpty()
	@IsJWT()
	token: string;
}
