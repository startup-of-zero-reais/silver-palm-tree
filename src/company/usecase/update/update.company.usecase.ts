import { HttpStatus, Inject } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Company from '@/company/domain/entity/company.entity';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { CompanyMongoRepository } from '@/company/infra/repository/mongo/company.repository';
import { UpdateCompanyInputDto } from './update-company.dto';

export class UpdateCompanyUseCase implements UseCaseInterface {
	constructor(
		@Inject(CompanyMongoRepository)
		private readonly companyRepository: CompanyRepositoryInterface,
	) {}

	async execute(input: UpdateCompanyInputDto): Promise<Company> {
		const company = await this.companyRepository.find(input.id);
		if (!company)
			throw new HttpErrorException(
				'Company not found',
				HttpStatus.NOT_FOUND,
			);

		company.update({ logo: input.logo, description: input.description });
		await this.companyRepository.update(company);

		return company;
	}
}
