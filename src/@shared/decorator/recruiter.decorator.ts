import {
	createParamDecorator,
	ExecutionContext,
	HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { HttpErrorException } from '../exception-filter/http-error.exception';

export const LoggedRecruiter = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();

		const user: any = request.user;

		if (user.recruiter) {
			return user.recruiter;
		}

		const aud = request.header['x-audience'];

		if (['recruiter', 'both', undefined].includes(aud))
			throw new HttpErrorException(
				'You can not consume this service',
				HttpStatus.FORBIDDEN,
			);
	},
);
