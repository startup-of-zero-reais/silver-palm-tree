import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Company from '@/company/domain/entity/company.entity';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { CompanyMongoRepository } from '@/company/infra/repository/mongo/company.repository';
import { CreateCompanyInputDto } from './create.dto';

@Injectable()
export class CreateCompanyUseCase implements UseCaseInterface {
	constructor(
		@Inject(CompanyMongoRepository)
		private readonly companyRepository: CompanyRepositoryInterface,
	) {}

	async execute(input: CreateCompanyInputDto): Promise<Company> {
		const company = new Company({
			cnpj: input.cnpj,
			description: input.description,
			logo: input.logo,
		});
		await this.companyRepository.create(company);

		return company;
	}
}
