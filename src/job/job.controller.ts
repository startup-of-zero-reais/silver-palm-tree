import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LoggedRecruiter, MustBeAuth } from '@/@shared/decorator';
import { Recruiter } from '@/recruiter/domain';
import { CreateJobInputDto } from './usecase/create/create.dto';
import { CreateJobUseCase } from './usecase/create/create.usecase';
import { FindJobInputDto, FindJobOutputDto } from './usecase/find/find.job.dto';
import { FindJobUseCase } from './usecase/find/find.job.usecase';

@Controller('jobs')
@MustBeAuth()
export class JobController {
	constructor(
		private readonly createJobUseCase: CreateJobUseCase,
		private readonly findJobUseCase: FindJobUseCase,
	) {}

	@Post()
	async create(
		@LoggedRecruiter() recruiter: Recruiter,
		@Body() input: CreateJobInputDto,
	) {
		input.owner = recruiter.id;
		return this.createJobUseCase.execute(input);
	}

	@Get(':id')
	async getSingleJob(@Param('id') id: string) {
		const input = new FindJobInputDto();
		input.id = id;

		const job = await this.findJobUseCase.execute(input);
		return plainToClass(FindJobOutputDto, job);
	}
}
