import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CandidateRepositoryInterface } from '@/candidate/domain/repository/candidate.repository.interface';
import Candidate from '@/candidate/domain/entity/candidate.entity';
import Techs from '@/candidate/domain/value-object/techs-value-object';
import { ProfessionalExperience } from '@/candidate/domain/value-object/professional-experience';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import { Candidate as Entity, CandidateDocument } from './candidate.model';
import PaginationPresenter from '../presenter/pagination.presenter';

@Injectable()
export default class CandidateMongoRepository
  implements CandidateRepositoryInterface
{
  constructor(
    @InjectModel(Entity.name)
    private candidateModel: Model<CandidateDocument>,
  ) {}

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
      techs: entity.techs.map((tech) => ({
        tech: tech.tech,
        knowledge_level: tech.knowledge_level,
      })),
      professionalExperiences: entity.professionalExperiences.map(
        (experience) => ({
          acting_time: experience.acting_time,
          company: experience.company,
          description: experience.description,
          qualification: experience.qualification,
          role: experience.role,
        }),
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
        techs: entity.techs.map((tech) => ({
          tech: tech.tech,
          knowledge_level: tech.knowledge_level,
        })),
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
      techs: this.mapToTechs(object.techs),
      professionalExperiences: this.mapToExperienceProfessional(
        object.professionalExperiences,
      ),
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    });
  }

  private mapToTechs(techs) {
    return techs.map(
      (tech) =>
        new Techs({
          tech: tech.tech,
          knowledge_level: tech.knowledge_level,
        }),
    );
  }

  private mapToExperienceProfessional(experiences) {
    return experiences.map(
      (experience) =>
        new ProfessionalExperience({
          acting_time: experience.acting_time,
          company: experience.company,
          description: experience.description,
          qualification: experience.qualification,
          role: experience.role,
        }),
    );
  }
}
