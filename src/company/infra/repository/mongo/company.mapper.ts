import Company, { Props } from '@/company/domain/entity/company.entity';
import { Company as CompanyEntity } from './company.model';

export class CompanyMapper {
	static toDomain(data: Partial<CompanyEntity>): Company {
		const state: Props = {
			id: data._id,
			cnpj: data.cnpj,
			description: data.description,
			logo: data.logo,
			status: data.status,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		};

		return new Company(state);
	}

	static toEntity(data: Company): CompanyEntity {
		const entity = new CompanyEntity();

		if (data.id) entity._id = data.id;
		if (data.cnpj) entity._id = data.cnpj;
		if (data.description) entity.description = data.description;
		if (data.logo) entity.logo = data.logo;
		if (data.status) entity.status = data.status;
		if (data.createdAt) entity.createdAt = data.createdAt;
		if (data.updatedAt) entity.updatedAt = data.updatedAt;

		return entity;
	}
}
