import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '@/auth/usecase/login/login.usecase';
import { LoginOkDto } from '../login/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly loginUseCase: LoginUseCase) {
		super({ usernameField: 'email' });
	}

	async validate(username: string, password: string): Promise<LoginOkDto> {
		const user = await this.loginUseCase.execute({
			email: username,
			password,
		});

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
