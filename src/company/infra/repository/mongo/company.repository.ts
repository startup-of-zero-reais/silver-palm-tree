import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import CompanyEntity from '@/company/domain/entity/company.entity';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { Company, CompanyDocument } from './company.model';

@Injectable()
export class CompanyMongoRepository implements CompanyRepositoryInterface {
	constructor(
		@InjectModel(Company.name)
		private candidateModel: Model<CompanyDocument>,
	) {}
	async create(entity: CompanyEntity): Promise<void> {
		await this.candidateModel.create({
			_id: entity.id,
			cnpj: entity.cnpj,
			logo: entity.logo,
			description: entity.description,
		});
	}
	update(entity: CompanyEntity): Promise<void> {
		throw new Error('Method not implemented.');
	}
	find(id: string): Promise<CompanyEntity> {
		throw new Error('Method not implemented.');
	}
	findByEmail(email: string): Promise<CompanyEntity> {
		throw new Error('Method not implemented.');
	}
	paginate(
		per_page: number,
		page: number,
	): Promise<PaginationInterface<CompanyEntity>> {
		throw new Error('Method not implemented.');
	}
}
