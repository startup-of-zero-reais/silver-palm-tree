import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import PaginationPresenter from '@/candidate/infra/repository/presenter/pagination.presenter';
import CompanyEntity from '@/company/domain/entity/company.entity';
import { CompanyRepositoryInterface } from '@/company/domain/repository/company.repository.interface';
import { Company, CompanyDocument } from './company.model';

@Injectable()
export class CompanyMongoRepository implements CompanyRepositoryInterface {
	constructor(
		@InjectModel(Company.name)
		private companyModel: Model<CompanyDocument>,
	) {}

	async findByCnpj(cnpj: string): Promise<CompanyEntity> {
		const companyDb = await this.companyModel
			.findOne({ cnpj: cnpj })
			.exec();
		return this.toDomain(companyDb);
	}

	async create(entity: CompanyEntity): Promise<void> {
		await this.companyModel.create({
			_id: entity.id,
			cnpj: entity.cnpj,
			logo: entity.logo,
			description: entity.description,
			status: entity.status,
		});
	}

	update(entity: CompanyEntity): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async find(id: string): Promise<CompanyEntity> {
		const companyDb = await this.companyModel.findOne({ _id: id }).exec();
		return this.toDomain(companyDb);
	}

	async paginate(
		per_page: number,
		page: number,
	): Promise<PaginationInterface<CompanyEntity>> {
		const companiesDb = this.companyModel;

		const [countCompanies, companies] = await Promise.all([
			await companiesDb.find().countDocuments().exec(),
			await companiesDb
				.find()
				.sort({ createdAt: -1 })
				.limit(per_page)
				.skip((page - 1) * per_page)
				.exec(),
		]);

		return new PaginationPresenter(
			companies.map((candidate) => this.toDomain(candidate)),
			per_page,
			page,
			countCompanies,
		);
	}

	delete(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	private toDomain(object: any): CompanyEntity {
		if (!object) return; // return empty if has no recruiter
		return new CompanyEntity({
			id: object._id,
			cnpj: object.cnpj,
			logo: object.logo,
			description: object.description,
			status: object.status,
			createdAt: object.createdAt,
			updatedAt: object.updatedAt,
		});
	}
}
