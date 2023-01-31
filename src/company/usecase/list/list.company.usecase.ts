import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { CompanyMongoRepository } from '@/company/infra/repository/mongo/company.repository';
import { ListCompaniesInputDto, ListCompaniesOutputDto } from './list.dto';

@Injectable()
export class ListCompanyUseCase implements UseCaseInterface {
	constructor(
		@Inject(CompanyMongoRepository)
		private readonly companyRepository: CompanyRepositoryInterface,
	) {}

	async execute(
		input: ListCompaniesInputDto,
	): Promise<ListCompaniesOutputDto> {
		const companies = await this.companyRepository.paginate(
			input.page_size,
			input.page,
		);

		return {
			data: companies.items().map((company) => ({
				id: company.id,
				logo: company.logo,
				cnpj: company.cnpj,
				description: company.description,
				updatedAt: company.updatedAt,
				createdAt: company.createdAt,
			})),
			meta: {
				total: companies.total(),
				currentPage: companies.currentPage(),
				firstPage: companies.firstPage(),
				lastPage: companies.lastPage(),
				perPage: companies.perPage(),
			},
		};
	}
}
