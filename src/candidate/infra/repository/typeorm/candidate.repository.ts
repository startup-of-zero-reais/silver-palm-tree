import { Injectable } from '@nestjs/common';

import { CandidateRepositoryInterface } from '../../../../candidate/domain/repository/candidate.repository.interface';
import Entity from '../../../../candidate/domain/entity/candidate.entity';
import { InjectModel } from '@nestjs/mongoose';
import Candidate from '../../../../candidate/domain/entity/candidate.entity';
import { Model } from 'mongoose';
import { CandidateDocument } from './candidate.model';
import Techs from '../../../../candidate/domain/value-object/techs-value-object';

@Injectable()
export default class CandidateMongoRepository
  implements CandidateRepositoryInterface
{
  constructor(
    @InjectModel(Candidate.name)
    private candidateModel: Model<CandidateDocument>,
  ) {}

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
    });
  }

  async update(entity: Entity): Promise<void> {
    throw new Error('Not implemented');
  }
  async find(id: string): Promise<Entity> {
    const candidate = await this.candidateModel.findOne({ _id: id }).exec();
    return this.toDomain(candidate);
  }
  async findAll(): Promise<Entity[]> {
    const candidateDb = await this.candidateModel.find().exec();

    return candidateDb.map((candidate) => this.toDomain(candidate));
  }

  private toDomain(object: any): Entity {
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
