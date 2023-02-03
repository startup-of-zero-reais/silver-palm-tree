import {
	createParamDecorator,
	ExecutionContext,
	HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpErrorException } from '../exception-filter/http-error.exception';

export const LoggedCandidate = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();

		const user: any = request.user;

		if (user.candidate) {
			return user.candidate;
		}

		const aud = request.header['x-audience'];

		if (['candidate', 'both', undefined].includes(aud))
			throw new HttpErrorException(
				'invalid session',
				HttpStatus.UNAUTHORIZED,
			);
	},
);
