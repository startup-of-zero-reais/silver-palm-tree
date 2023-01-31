import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Company from '../domain/entity/company.entity';
import { CreateCompanyUseCase } from '../usecase/create/create.company.usecase';
import { FindByCNPJUseCase } from '../usecase/find-by-cnpj/find-by-cnpj.usecase';
import CompanyFacadeInterface from './company.facade.interface';

@Injectable()
export class CompanyFacade implements CompanyFacadeInterface {
	constructor(
		@Inject(CreateCompanyUseCase)
		private readonly _createUseCase: CreateCompanyUseCase,
		@Inject(FindByCNPJUseCase)
		private readonly _findByCnpjUseCase: UseCaseInterface,
	) {}

	async create(company: Company): Promise<Company> {
		return await this._createUseCase.execute({
			cnpj: company.cnpj,
			description: company.description,
			logo: company.logo,
		});
	}

	async getByCNPJ(cnpj: string): Promise<Company> {
		return await this._findByCnpjUseCase.execute({ cnpj });
	}
}
