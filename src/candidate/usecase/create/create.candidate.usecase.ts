import { Inject, Injectable } from '@nestjs/common';
import CandidateMongoRepository from '../../../candidate/infra/repository/mongo/candidate.repository';
import CandidateFactory from '../../../candidate/domain/factory/candidate.factory';
import { CandidateRepositoryInterface } from '../../../candidate/domain/repository/candidate.repository.interface';
import {
  CreateCandidateInputDto,
  CreateCandidateOutputDto,
} from './create.dto';

@Injectable()
export default class CreateCandidateUseCase {
  constructor(
    @Inject(CandidateMongoRepository)
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(
    input: CreateCandidateInputDto,
  ): Promise<CreateCandidateOutputDto> {
    const {
      email,
      image,
      name,
      password,
      phone,
      techs,
      professionalExperiences,
    } = input;

    const candidate = CandidateFactory.create(
      { email, image, name, password, phone },
      techs,
      professionalExperiences,
    );

    candidate.encrypt_password();

    await this.candidateRepository.create(candidate);

    return {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      image: candidate.image,
      phone: candidate.phone,
      techs: candidate.techs.map((tech) => ({
        knowledge_level: tech.knowledge_level,
        tech: tech.tech,
      })),
      professionalExperiences: candidate.professionalExperiences.map(
        (experience) => ({
          acting_time: experience.acting_time,
          company: experience.company,
          description: experience.description,
          qualification: experience.qualification,
          role: experience.role,
        }),
      ),
      updatedAt: candidate.updatedAt,
      createdAt: candidate.createdAt,
    };
  }
}
