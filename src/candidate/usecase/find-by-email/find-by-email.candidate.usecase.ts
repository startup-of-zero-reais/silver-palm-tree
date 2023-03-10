import { Inject, Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Candidate from '@/candidate/domain/entity/candidate.entity';
import { CandidateRepositoryInterface } from '@/candidate/domain/repository/candidate.repository.interface';
import CandidateMongoRepository from '@/candidate/infra/repository/mongo/candidate.repository';
import { FindByEmailInputDto } from './find-by-email.dto';

@Injectable()
export default class FindCandidateByEmailUsecase implements UseCaseInterface {
	constructor(
		@Inject(CandidateMongoRepository)
		private readonly candidateRepository: CandidateRepositoryInterface,
	) {}

	async execute(input: FindByEmailInputDto): Promise<Candidate> {
		const candidate = await this.candidateRepository.findByEmail(
			input.email,
		);

		if (!candidate) {
			throw new HttpErrorException('Candidate not found', 404);
		}

		return candidate;
	}
}
