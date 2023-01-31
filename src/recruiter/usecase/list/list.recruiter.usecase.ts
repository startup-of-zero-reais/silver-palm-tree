import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { RecruiterRepositoryInterface } from '../../domain';
import RecruiterMongoRepository from '../../infra/repository/mongo/recruiter.repository';
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
		const recruiters = await this.recruiterRepository.paginate(
			input.page_size,
			input.page,
		);

		return {
			data: recruiters.items().map((recruiter) => ({
				id: recruiter.id,
				name: recruiter.name,
				email: recruiter.email,
				image: recruiter.image,
				status: recruiter.status,
				company: {
					id: recruiter.companyID,
					cnpj: recruiter.companyCNPJ,
				},
				updatedAt: recruiter.updatedAt,
				createdAt: recruiter.createdAt,
			})),
			meta: {
				total: recruiters.total(),
				currentPage: recruiters.currentPage(),
				firstPage: recruiters.firstPage(),
				lastPage: recruiters.lastPage(),
				perPage: recruiters.perPage(),
			},
		};
	}
}
