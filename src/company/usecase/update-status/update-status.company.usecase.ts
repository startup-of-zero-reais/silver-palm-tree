import { HttpStatus, Inject } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Company from '@/company/domain/entity/company.entity';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { CompanyMongoRepository } from '@/company/infra/repository/mongo/company.repository';
import { UpdateStatusCompanyInputDto } from './update-status.company.dto';

export class UpdateStatusCompanyUseCase implements UseCaseInterface {
	constructor(
		@Inject(CompanyMongoRepository)
		private readonly companyRepository: CompanyRepositoryInterface,
	) {}

	async execute(input: UpdateStatusCompanyInputDto): Promise<Company> {
		const company = await this.companyRepository.find(input.id);
		if (!company)
			throw new HttpErrorException(
				'Company not found',
				HttpStatus.NOT_FOUND,
			);
		company.changeStatus(input.status);

		await this.companyRepository.update(company);

		return company;
	}
}
