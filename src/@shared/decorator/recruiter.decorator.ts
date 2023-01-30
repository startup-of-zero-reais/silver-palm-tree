import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedRecruiter = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();

		if (request.user.recruiter) {
			return request.user.recruiter;
		}

		return undefined;
	},
);
