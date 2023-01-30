import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import CompanyFacadeInterface from './company.facade.interface';

@Injectable()
export class CompanyFacade implements CompanyFacadeInterface {
	async getByCNPJ(cnpj: string) {
		return {
			cnpj,
			id: randomUUID(),
		};
	}
}
