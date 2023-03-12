import { Inject, Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { ApplyFacade } from '@/apply/facade/apply.facade';
import ApplyFacadeInterface from '@/apply/facade/apply.facade.interface';
import CandidateFacade from '@/candidate/facade/candidate.facade';
import CandidateFacadeInterface from '@/candidate/facade/candidate.facade.interface';
import { JobAdMongoRepository } from '@/job/infra/repository/mongo/job-ad.repository';
import { AppliesInputDto } from './applies.dto';

@Injectable()
export class AppliesUseCase implements UseCaseInterface {
	constructor(
		@Inject(JobAdMongoRepository)
		private readonly repository: JobAdMongoRepository,

		@Inject(ApplyFacade)
		private readonly applyFacade: ApplyFacadeInterface,

		@Inject(CandidateFacade)
		private readonly candidateFacade: CandidateFacadeInterface,
	) {}

	async execute(input: AppliesInputDto): Promise<any> {
		const job = await this.repository.getJob(input);
		const owners = new Set([job.owner, ...job.editors]);
		if (!owners.has(input.recruiterId)) {
			throw new HttpErrorException('job not found', 404);
		}

		const applies = await this.applyFacade.findByJobId(job.id);

		const candidateApplyIds = [
			...new Set([...applies.map((apply) => apply.candidate.id)]),
		];

		const candidates = await this.candidateFacade.getByIds(
			candidateApplyIds,
		);

		return candidates;
	}
}
