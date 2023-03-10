import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import PaginationPresenter from '@/candidate/infra/repository/presenter/pagination.presenter';
import { CompanyMapper } from '@/company/infra/repository/mongo/company.mapper';
import { Recruiter, RecruiterRepositoryInterface } from '@/recruiter/domain';
import { RecruiterMapper } from './recruiter.mapper';
import { Recruiter as Entity, RecruiterDocument } from './recruiter.model';

@Injectable()
export default class RecruiterMongoRepository
	implements RecruiterRepositoryInterface
{
	constructor(
		@InjectModel(Entity.name)
		private recruiterModel: Model<RecruiterDocument>,
	) {}

	async delete(id: string): Promise<void> {
		await this.recruiterModel.deleteOne({ _id: id });
	}

	async create(entity: Recruiter): Promise<void> {
		await this.recruiterModel.create({
			_id: entity.id,
			name: entity.name,
			email: entity.email,
			image: entity.image,
			password: entity.password,
			status: entity.status,
			company: {
				_id: entity.companyID,
				cnpj: entity.companyCNPJ,
				admin: entity.id,
			},
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		});
	}

	async update(entity: Recruiter): Promise<void> {
		await this.recruiterModel.updateOne(
			{ _id: entity.id },
			{ $set: RecruiterMapper.domainToOrm(entity) },
		);
	}

	async find(id: string): Promise<Recruiter> {
		const recruiter = await this.recruiterModel
			.findOne({ _id: id })
			.populate('company')
			.exec();

		return this.toDomain(recruiter);
	}

	async findByEmail(email: string): Promise<Recruiter> {
		const recruiter = await this.recruiterModel
			.findOne({ email })
			.populate('company')
			.exec();

		return this.toDomain(recruiter);
	}

	async paginate(
		per_page: number,
		page: number,
	): Promise<PaginationInterface<Recruiter>> {
		const recruiterDb = this.recruiterModel;

		const [countCandidates, candidates] = await Promise.all([
			await recruiterDb.find().countDocuments().exec(),
			await recruiterDb
				.find()
				.populate('company')
				.sort({ createdAt: -1 })
				.limit(per_page)
				.skip((page - 1) * per_page)
				.exec(),
		]);

		return new PaginationPresenter(
			candidates.map((candidate) => this.toDomain(candidate)),
			per_page,
			page,
			countCandidates,
		);
	}

	private toDomain(object?: RecruiterDocument): Recruiter {
		if (!object) return; // return empty if has no recruiter

		const recruiter = new Recruiter({
			id: object._id,
			name: object.name,
			email: object.email,
			password: object.password,
			image: object.image,
			company: {
				id: object.company._id,
				cnpj: object.company.cnpj,
				isAdmin: object._id == object.company.admin,
			},
			status: object.status,
		});

		if (object.company)
			recruiter.attachCompany(CompanyMapper.toDomain(object.company));

		return recruiter;
	}
}
