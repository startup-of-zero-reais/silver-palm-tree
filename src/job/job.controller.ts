import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LoggedRecruiter, MustBeAuth } from '@/@shared/decorator';
import { Recruiter } from '@/recruiter/domain';
import { Status } from './domain/entity/job.entity';
import { CreateJobInputDto } from './usecase/create/create.dto';
import { CreateJobUseCase } from './usecase/create/create.usecase';
import {
	FindJobByIDInputDto,
	FindJobByIDOutputDto,
} from './usecase/find-by-id/find-by-id.job.dto';
import { FindJobByIDUseCase } from './usecase/find-by-id/find-by-id.job.usecase';
import { UpdateJobStatusInputDto } from './usecase/update-job-status/update-job-status.dto';
import { UpdateJobStatusUseCase } from './usecase/update-job-status/update-job-status.usecase';

@Controller('jobs')
@MustBeAuth()
export class JobController {
	constructor(
		private readonly createJobUseCase: CreateJobUseCase,
		private readonly findJobUseCase: FindJobByIDUseCase,
		private readonly updateJobStatusUseCase: UpdateJobStatusUseCase,
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
		const input = new FindJobByIDInputDto();
		input.id = id;

		const job = await this.findJobUseCase.execute(input);
		return plainToClass(FindJobByIDOutputDto, job);
	}

	@Patch(':id/activate')
	async activateJob(
		@LoggedRecruiter() recruiter: Recruiter,
		@Param('id') id: string,
	) {
		const input: UpdateJobStatusInputDto = new UpdateJobStatusInputDto();
		input.id = id;
		input.editor = recruiter.id;
		input.status = Status.ACTIVATED;

		return this.updateJobStatusUseCase.execute(input);
	}
}
