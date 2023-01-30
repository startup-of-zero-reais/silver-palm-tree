import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Company from '../domain/entity/company.entity';
import { CompanyRepositoryInterface } from '../domain/repository/company.repository.interface';
import { CreateCompanyInputDto } from './create.dto';

export class CreateCompanyUseCase implements UseCaseInterface {
	constructor(
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
