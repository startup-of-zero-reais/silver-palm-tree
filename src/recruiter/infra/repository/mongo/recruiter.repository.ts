import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import { Recruiter, RecruiterRepositoryInterface } from '@/recruiter/domain';
import { Recruiter as Entity, RecruiterDocument } from './recruiter.model';

@Injectable()
export default class RecruiterMongoRepository
  implements RecruiterRepositoryInterface
{
  constructor(
    @InjectModel(Entity.name)
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
    const recruiter = await this.recruiterModel.findById(id).exec();
    return this.toDomain(recruiter);
  }

  async findByEmail(email: string): Promise<Recruiter> {
    const recruiter = await this.recruiterModel.findOne({ email }).exec();
    return this.toDomain(recruiter);
  }

  async paginate(
    per_page: number,
    page: number,
  ): Promise<PaginationInterface<Recruiter>> {
    throw new Error('Method paginate not implemented.');
  }

  private toDomain(object?: RecruiterDocument): Recruiter {
    if (!object) return; // return empty if has no recruiter

    return new Recruiter({
      id: object._id,
      name: object.name,
      email: object.email,
      password: object.password,
      image: object.image,
      company: {
        id: object.company.id,
        cnpj: object.company.cnpj,
      },
      status: object.status,
    });
  }
}
