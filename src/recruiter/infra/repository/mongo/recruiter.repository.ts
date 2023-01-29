import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import { Recruiter, RecruiterRepositoryInterface } from '@/recruiter/domain';
import {
  Recruiter as RecruiterEntity,
  RecruiterDocument,
} from './recruiter.model';

@Injectable()
export default class RecruiterMongoRepository
  implements RecruiterRepositoryInterface
{
  constructor(
    @InjectModel(RecruiterEntity.name)
    private recruiterModel: Model<RecruiterDocument>,
  ) {}

  async create(entity: Recruiter): Promise<void> {
    await this.recruiterModel.create({
      _id: entity.id,
      name: entity.name,
      email: entity.email,
      image: entity.image,
      password: entity.password,
      status: entity.status,
      company: {
        id: entity.companyID,
        cnpj: entity.companyCNPJ,
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async update(entity: Recruiter): Promise<void> {
    throw new Error('Method update not implemented.');
  }

  async find(id: string): Promise<Recruiter> {
    throw new Error('Method find not implemented.');
  }

  async findByEmail(email: string): Promise<Recruiter> {
    throw new Error('Method findByEmail not implemented.');
  }

  async paginate(
    per_page: number,
    page: number,
  ): Promise<PaginationInterface<Recruiter>> {
    throw new Error('Method paginate not implemented.');
  }
}
