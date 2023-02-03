import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Company from '@/company/domain/entity/company.entity';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { CompanyMongoRepository } from '@/company/infra/repository/mongo/company.repository';
import { FindByCNPJCompanyInputDto } from './find-by-cnpj.dto';

@Injectable()
export class FindByCNPJUseCase implements UseCaseInterface {
	constructor(
		@Inject(CompanyMongoRepository)
		private readonly companyRepository: CompanyRepositoryInterface,
	) {}

	async execute(input: FindByCNPJCompanyInputDto): Promise<Company> {
		const company = await this.companyRepository.findByCnpj(input.cnpj);
		if (!company) return null;
		return company;
	}
}
