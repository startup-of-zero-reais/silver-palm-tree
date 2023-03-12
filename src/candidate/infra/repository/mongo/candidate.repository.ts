import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import { Candidate, CandidateRepositoryInterface } from '@/candidate/domain';
import PaginationPresenter from '../presenter/pagination.presenter';
import { CandidateMapper } from './candidate.mapper';
import { Candidate as Entity, CandidateDocument } from './candidate.model';
import { ProfessionalExperienceMapper } from './professional-experience.mapper';
import { TechsMapper } from './techs.mapper';

@Injectable()
export default class CandidateMongoRepository
	implements CandidateRepositoryInterface
{
	constructor(
		@InjectModel(Entity.name)
		private candidateModel: Model<CandidateDocument>,
	) {}

	async findByIds(ids: string[]): Promise<Candidate[]> {
		const candidates = await this.candidateModel.find({
			_id: { $in: ids },
		});

		return CandidateMapper.arrayToDomain(candidates);
	}

	delete(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async paginate(
		per_page = 10,
		page = 1,
	): Promise<PaginationInterface<Candidate>> {
		const candidatesDb = this.candidateModel;

		const [countCandidates, candidates] = await Promise.all([
			await candidatesDb.find().countDocuments().exec(),
			await candidatesDb
				.find()
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

	async create(entity: Candidate): Promise<void> {
		await this.candidateModel.create({
			_id: entity.id,
			name: entity.name,
			email: entity.email,
			image: entity.image,
			password: entity.password,
			phone: entity.phone,
			techs: TechsMapper.ToObject(entity.techs),
			professionalExperiences: ProfessionalExperienceMapper.ToObject(
				entity.professionalExperiences,
			),
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		});
	}

	async update(entity: Candidate): Promise<void> {
		await this.candidateModel
			.findByIdAndUpdate(entity.id, {
				name: entity.name,
				image: entity.image,
				phone: entity.phone,
				techs: TechsMapper.ToObject(entity.techs),
			})
			.populate('techs');
	}

	async findByEmail(email: string): Promise<Candidate> {
		const candidate = await this.candidateModel.findOne({ email }).exec();
		return this.toDomain(candidate);
	}

	async find(id: string): Promise<Candidate> {
		const candidate = await this.candidateModel.findOne({ _id: id }).exec();
		return this.toDomain(candidate);
	}

	private toDomain(object?: any): Candidate {
		if (!object) throw new BadRequestException(`Candidate not found`);

		return new Candidate({
			id: object._id,
			name: object.name,
			email: object.email,
			password: object.password,
			image: object.image,
			phone: object.phone,
			techs: TechsMapper.ToDomain(object.techs),
			professionalExperiences: ProfessionalExperienceMapper.ToDomain(
				object.professionalExperiences,
			),
			createdAt: object.createdAt,
			updatedAt: object.updatedAt,
		});
	}
}
