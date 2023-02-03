import Company from '../domain/entity/company.entity';

export default interface CompanyFacadeInterface {
	getByCNPJ(cnpj: string): Promise<Company>;
	create(company: Company): Promise<Company>;
}
