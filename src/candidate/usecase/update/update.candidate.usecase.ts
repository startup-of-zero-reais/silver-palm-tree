import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
	Candidate,
	Tech as Techs,
	CandidateRepositoryInterface,
	ProfessionalExperience,
} from '@/candidate/domain';
import CandidateMongoRepository from '@/candidate/infra/repository/mongo/candidate.repository';
import { UpdateCandidateInputDto } from './update.candidate.dto';

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
