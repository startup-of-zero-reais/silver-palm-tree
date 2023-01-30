import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import constants from '@/auth/auth.constants';
import { ValidateSessionUseCase } from '../validate-session/validate-session.usecase';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		config: ConfigService,
		validateSessionUseCase: ValidateSessionUseCase,
	) {
		super(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([
					JwtStrategy.fromCookies,
					JwtStrategy.fromAuthorizationHeader,
				]),
				ignoreExpiration: false,
				secretOrKey: config.get('SESSION_SECRET'),
			},
			validateSessionUseCase.validateSession.bind(validateSessionUseCase),
		);
	}

	private static fromCookies(request: Request) {
		const auth_token = request.cookies[constants.SESSION_COOKIE];

		console.log('COOKIE', auth_token);
		if (!auth_token) return ``;

		return auth_token;
	}

	private static fromAuthorizationHeader(request: Request): string {
		console.log(
			'HEADER',
			request.headers.authorization?.replace(/^bearer\s/i, ''),
		);
		if (request.headers.authorization) {
			return request.headers.authorization.replace(/^bearer\s/i, '');
		}

		return '';
	}
}
