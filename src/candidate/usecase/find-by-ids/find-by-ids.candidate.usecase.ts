import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { CandidateRepositoryInterface } from '@/candidate/domain';
import CandidateMongoRepository from '@/candidate/infra/repository/mongo/candidate.repository';
import { FindByIdsInputDto } from './find-by-ids.dto';

@Injectable()
export class FindByIdsUseCase implements UseCaseInterface {
	constructor(
		@Inject(CandidateMongoRepository)
		private readonly candidateRepository: CandidateRepositoryInterface,
	) {}
	async execute(input: FindByIdsInputDto) {
		return this.candidateRepository.findByIds(input.ids);
	}
}
