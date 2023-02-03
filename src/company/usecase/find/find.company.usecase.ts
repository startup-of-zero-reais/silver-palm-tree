import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Company from '@/company/domain/entity/company.entity';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { CompanyMongoRepository } from '@/company/infra/repository/mongo/company.repository';
import { FindCompanyInputDto } from './find.dto';

@Injectable()
export class FindCompanyUseCase implements UseCaseInterface {
	constructor(
		@Inject(CompanyMongoRepository)
		private readonly companyRepository: CompanyRepositoryInterface,
	) {}

	async execute(input: FindCompanyInputDto): Promise<Company> {
		const company = await this.companyRepository.find(input.id);

		if (!company) throw new NotFoundException('Company not found');

		return company;
	}
}
