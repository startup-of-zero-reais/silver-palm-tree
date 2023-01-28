import { ProfessionalExperience } from '../../../candidate/domain/value-object/professional-experience';
import { CandidateRepositoryInterface } from '../../../candidate/domain/repository/candidate.repository.interface';
import Techs from '../../../candidate/domain/value-object/techs-value-object';
import {
  UpdateCandidateInputDto,
  UpdateCandidateOutputDto,
} from './update.candidate.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import CandidateMongoRepository from '../../../candidate/infra/repository/mongo/candidate.repository';
import Candidate from '../../../candidate/domain/entity/candidate.entity';

@Injectable()
export default class UpdateCandidateUseCase {
  constructor(
    @Inject(CandidateMongoRepository)
    private readonly candidateRepository: CandidateRepositoryInterface,
  ) {}

  async execute(input: UpdateCandidateInputDto): Promise<Candidate> {
    const candidate = await this.candidateRepository.find(input.id);

    if (!candidate) {
      throw new BadRequestException('Candidate not found');
    }

    const { name, image, phone, techs, professionalExperiences } = input;

    candidate.update({
      name,
      image,
      phone,
      techs: techs?.map((tech) => {
        console.log({ tech });
        return new Techs({
          knowledge_level: tech.knowledge_level,
          tech: tech.tech,
        });
      }),
      professionalExperiences: professionalExperiences?.map(
        (experience) =>
          new ProfessionalExperience({
            acting_time: experience.acting_time,
            company: experience.company,
            description: experience.description,
            qualification: experience.qualification,
            role: experience.role,
          }),
      ),
    });

    await this.candidateRepository.update(candidate);

    return candidate;
  }
}
