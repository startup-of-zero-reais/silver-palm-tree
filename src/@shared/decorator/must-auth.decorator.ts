import { UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from '@/auth/usecase/authorization-strategy/token.guard';

export function MustBeAuth() {
	return UseGuards(AuthTokenGuard);
}
