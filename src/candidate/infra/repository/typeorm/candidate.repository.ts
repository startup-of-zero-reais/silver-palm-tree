import { BadRequestException, Injectable } from '@nestjs/common';

import { CandidateRepositoryInterface } from '../../../../candidate/domain/repository/candidate.repository.interface';
import Entity from '../../../../candidate/domain/entity/candidate.entity';
import { InjectModel } from '@nestjs/mongoose';
import Candidate from '../../../../candidate/domain/entity/candidate.entity';
import { Model } from 'mongoose';
import { CandidateDocument } from './candidate.model';
import Techs from '../../../../candidate/domain/value-object/techs-value-object';
import PaginationPresenter from '../presenter/pagination.presenter';
import { PaginationInterface } from 'src/@shared/repository/pagination-interface';

@Injectable()
export default class CandidateMongoRepository
  implements CandidateRepositoryInterface
{
  constructor(
    @InjectModel(Candidate.name)
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

  async create(entity: Entity): Promise<void> {
    await this.candidateModel.create({
      _id: entity.id,
      name: entity.name,
      email: entity.email,
      image: entity.image,
      phone: entity.phone,
      techs: entity.techs.map((tech) => ({
        tech: tech.tech,
        knowledge_level: tech.knowledge_level,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async update(entity: Entity): Promise<void> {
    throw new Error('Not implemented');
  }
  async find(id: string): Promise<Entity> {
    const candidate = await this.candidateModel.findOne({ _id: id }).exec();
    return this.toDomain(candidate);
  }

  private toDomain(object?: any): Entity {
    if (!object) throw new BadRequestException(`Candidate not found`);

    return new Entity({
      id: object._id,
      name: object.name,
      email: object.email,
      image: object.image,
      phone: object.phone,
      techs: object.techs.map(
        (tech) =>
          new Techs({
            tech: tech.tech,
            knowledge_level: tech.knowledge_level,
          }),
      ),
    });
  }
}
