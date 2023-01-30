import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedCandidate = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();

		if (request.user.candidate) {
			return request.user.candidate;
		}

		return undefined;
	},
);
