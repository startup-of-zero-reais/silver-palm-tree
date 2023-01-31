import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { RecruiterRepositoryInterface } from '../domain';
import RecruiterMongoRepository from '../infra/repository/mongo/recruiter.repository';
import { ListRecruiterInputDto, ListRecruiterOutputDto } from './list.dto';

@Injectable()
export class ListRecruiterUseCase implements UseCaseInterface {
	constructor(
		@Inject(RecruiterMongoRepository)
		private readonly recruiterRepository: RecruiterRepositoryInterface,
	) {}

	async execute(
		input: ListRecruiterInputDto,
	): Promise<ListRecruiterOutputDto> {
		const candidates = await this.recruiterRepository.paginate(
			input.page_size,
			input.page,
		);

		return {
			data: candidates.items().map((candidate) => ({
				id: candidate.id,
				name: candidate.name,
				email: candidate.email,
				image: candidate.image,
				company: {
					id: candidate.companyID,
					cnpj: candidate.companyCNPJ,
				},
				updatedAt: candidate.updatedAt,
				createdAt: candidate.createdAt,
			})),
			meta: {
				total: candidates.total(),
				currentPage: candidates.currentPage(),
				firstPage: candidates.firstPage(),
				lastPage: candidates.lastPage(),
				perPage: candidates.perPage(),
			},
		};
	}
}
