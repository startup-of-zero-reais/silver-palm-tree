/* eslint-disable prettier/prettier */
import { ObjectTransformer } from '@/@shared/helpers';
import Company, { Props } from '@/company/domain/entity/company.entity';
import { Company as CompanyEntity } from './company.model';

export class CompanyMapper {
	static toDomain(data: Partial<CompanyEntity>): Company {
		const state = ObjectTransformer.transform<
			Partial<CompanyEntity>,
			Props
		>(data)
			.property('_id').to('id')
			.property('cnpj').to('cnpj')
			.property('description').to('description')
			.property('logo').to('logo')
			.property('status').to('status')
			.property('admin').to('adminID')
			.property('createdAt').to('createdAt')
			.property('updatedAt').to('updatedAt')
			.transformed();

		return new Company(state);
	}

	static toEntity(data: Company): CompanyEntity {
		const entity = ObjectTransformer.transform<Company, CompanyEntity>(data)
			.property('id').to('_id')
			.property('cnpj').to('cnpj')
			.property('description').to('description')
			.property('logo').to('logo')
			.property('status').to('status')
			.property('createdAt').to('createdAt')
			.property('updatedAt').to('updatedAt')
			.transformed()

		return entity;
	}
}
