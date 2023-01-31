import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { Recruiter, RecruiterRepositoryInterface } from '@/recruiter/domain';
import RecruiterMongoRepository from '@/recruiter/infra/repository/mongo/recruiter.repository';
import { UpdateRecruiterInputDto } from './update.dto';

@Injectable()
export class UpdateRecruiterUseCase implements UseCaseInterface {
	constructor(
		@Inject(RecruiterMongoRepository)
		private readonly recruiterRepository: RecruiterRepositoryInterface,
	) {}

	async execute(input: UpdateRecruiterInputDto): Promise<Recruiter> {
		const recruiter = await this.recruiterRepository.find(input.id);

		if (!recruiter) {
			throw new NotFoundException('Recruiter not found');
		}

		recruiter.update({
			image: input.image,
			name: input.name,
		});

		await this.recruiterRepository.update(recruiter);

		return recruiter;
	}
}
