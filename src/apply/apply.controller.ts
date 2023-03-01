import { Body, Controller, Get, Post } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LoggedCandidate, MustBeAuth } from '@/@shared/decorator';
import { Candidate } from '@/candidate/domain';
import { CreateApplyInputDTO } from './usecase/create/create.dto';
import { CreateApplyUseCase } from './usecase/create/create.usecase';
import { ListAppliesOutputDTO } from './usecase/list/list.dto';
import { ListAppliesUseCase } from './usecase/list/list.usecase';

@Controller('apply')
export class ApplyController {
	constructor(
		private readonly createApplyUseCase: CreateApplyUseCase,
		private readonly listApplyUseCase: ListAppliesUseCase,
	) {}

	@Post()
	@MustBeAuth()
	async apply(
		@LoggedCandidate() candidate: Candidate,
		@Body() input: CreateApplyInputDTO,
	) {
		input.candidateID = candidate.id;
		return this.createApplyUseCase.execute(input);
	}

	@Get()
	@MustBeAuth()
	async list(@LoggedCandidate() candidate: Candidate) {
		return plainToClass(
			ListAppliesOutputDTO,
			await this.listApplyUseCase.execute(candidate.id),
		);
	}
}
