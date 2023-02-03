import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { SessionRepositoryInterface } from '@/auth/domain';
import { SessionMongoRepository } from '@/auth/infra/repository/mongo/session.repository';
import { LogoutInputDto } from './logout.dto';

@Injectable()
export class LogoutUseCase implements UseCaseInterface {
	constructor(
		@Inject(SessionMongoRepository)
		private readonly sessionRepository: SessionRepositoryInterface,
	) {}

	async execute(input: LogoutInputDto): Promise<any> {
		const session = await this.sessionRepository.findByToken(input.token);

		if (!session) {
			return;
		}

		console.log(session.isValidSession());

		return;
	}
}
