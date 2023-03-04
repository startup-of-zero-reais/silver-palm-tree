import { Inject, Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import {
	Candidate,
	CandidateFactory,
	CandidateRepositoryInterface,
} from '@/candidate/domain';
import CandidateMongoRepository from '@/candidate/infra/repository/mongo/candidate.repository';
import { CreateCandidateInputDto } from './create.dto';

@Injectable()
export default class CreateCandidateUseCase {
	constructor(
		@Inject(CandidateMongoRepository)
		private readonly candidateRepository: CandidateRepositoryInterface,
	) {}

	async execute(input: CreateCandidateInputDto): Promise<Candidate> {
		const {
			email,
			image,
			name,
			password,
			phone,
			techs,
			professionalExperiences,
		} = input;

		if (await this.candidateAlreadyExists(email)) {
			throw new HttpErrorException(
				'Candidate with this email already registered',
				409,
			);
		}

		const candidate = CandidateFactory.create(
			{ email, image, name, password, phone },
			techs,
			professionalExperiences,
		);

		candidate.encrypt_password();

		await this.candidateRepository.create(candidate);

		return candidate;
	}

	private async candidateAlreadyExists(email: string): Promise<boolean> {
		const result = await this.candidateRepository
			.findByEmail(email)
			.catch(() => undefined);

		return Boolean(result);
	}
}
