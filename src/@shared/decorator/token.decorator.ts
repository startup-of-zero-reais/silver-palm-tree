import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import authConstants from '@/auth/auth.constants';

export const AuthToken = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();

		let token = request.cookies[authConstants.SESSION_COOKIE];

		if (!token) {
			token = request.headers?.authorization?.replace(/^bearer\s/i, '');
		}

		return token;
	},
);
