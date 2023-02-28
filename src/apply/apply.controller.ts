import { Body, Controller, Post } from '@nestjs/common';
import { LoggedCandidate, MustBeAuth } from '@/@shared/decorator';
import { Candidate } from '@/candidate/domain';
import { CreateApplyInputDTO } from './usecase/create/create.dto';
import { CreateApplyUseCase } from './usecase/create/create.usecase';

@Controller('apply')
export class ApplyController {
	constructor(private readonly createApplyUseCase: CreateApplyUseCase) {}

	@Post()
	@MustBeAuth()
	async apply(
		@LoggedCandidate() candidate: Candidate,
		@Body() input: CreateApplyInputDTO,
	) {
		input.candidateID = candidate.id;
		return this.createApplyUseCase.execute(input);
	}
}
