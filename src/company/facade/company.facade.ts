import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import Company from '../domain/entity/company.entity';
import { FindByCNPJUseCase } from '../usecase/find-by-cnpj/find-by-cnpj.usecase';
import CompanyFacadeInterface from './company.facade.interface';

@Injectable()
export class CompanyFacade implements CompanyFacadeInterface {
	constructor(
		@Inject(FindByCNPJUseCase)
		private readonly _findByCnpjUseCase: FindByCNPJUseCase,
	) {}

	async getByCNPJ(cnpj: string): Promise<Company> {
		return await this._findByCnpjUseCase.execute({ cnpj });
	}
}
