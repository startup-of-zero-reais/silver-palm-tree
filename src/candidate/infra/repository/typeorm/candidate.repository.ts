import { Injectable } from '@nestjs/common';

import { CandidateRepositoryInterface } from '../../../../candidate/domain/repository/candidate.repository.interface';
import Entity from '../../../../candidate/domain/entity/candidate.entity';
import { InjectModel } from '@nestjs/mongoose';
import Candidate from '../../../../candidate/domain/entity/candidate.entity';
import { Model } from 'mongoose';
import { CandidateDocument } from './candidate.model';

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
    throw new Error('Not implemented');
  }
  async findAll(id: string): Promise<Entity[]> {
    throw new Error('Not implemented');
  }
}
