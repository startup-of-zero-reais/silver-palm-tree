import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
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
import { ListJobsInputDTO, ListJobsOutputDTO } from './usecase/list/list.dto';
import { ListJobsUseCase } from './usecase/list/list.usecase';
import { RefreshJobInputDTO } from './usecase/refresh/refresh.dto';
import { RefreshJobUseCase } from './usecase/refresh/refresh.usecase';
import { UpdateJobStatusInputDto } from './usecase/update-job-status/update-job-status.dto';
import { UpdateJobStatusUseCase } from './usecase/update-job-status/update-job-status.usecase';

@Controller('jobs')
export class JobController {
	constructor(
		private readonly createJobUseCase: CreateJobUseCase,
		private readonly findJobUseCase: FindJobByIDUseCase,
		private readonly updateJobStatusUseCase: UpdateJobStatusUseCase,
		private readonly listJobUseCase: ListJobsUseCase,
		private readonly refreshJobUseCase: RefreshJobUseCase,
	) {}

	@Post()
	@MustBeAuth()
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

	@Get()
	async getJobs(@Query() search: ListJobsInputDTO) {
		const result = await this.listJobUseCase.execute(search);
		return plainToClass(ListJobsOutputDTO, result);
	}

	@Patch(':id/activate')
	@MustBeAuth()
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

	@Patch(':id/refresh')
	@MustBeAuth()
	async refreshJob(
		@LoggedRecruiter() recruiter: Recruiter,
		@Param('id') id: string,
	) {
		const input: RefreshJobInputDTO = new RefreshJobInputDTO();
		input.id = id;
		input.requirer = recruiter.id;

		return this.refreshJobUseCase.execute(input);
	}
}
