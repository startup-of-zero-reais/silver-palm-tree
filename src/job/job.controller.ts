import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { LoggedRecruiter, MustBeAuth } from '@/@shared/decorator';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
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
import { UpdateInputDTO } from './usecase/update/update.dto';
import { UpdateUseCase } from './usecase/update/update.usecase';

@Controller('jobs')
export class JobController {
	constructor(
		private readonly createJobUseCase: CreateJobUseCase,
		private readonly findJobUseCase: FindJobByIDUseCase,
		private readonly updateJobUseCase: UpdateUseCase,
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
		if (!recruiter.canInteract())
			throw new HttpErrorException(
				'You can not perform this post action',
				401,
			);

		input.owner = recruiter.id;
		input.companyID = recruiter.companyID;
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

	@Put(':id')
	@MustBeAuth()
	async updateJob(
		@Param('id') id: string,
		@Body() body: UpdateInputDTO,
		@LoggedRecruiter() recruiter: Recruiter,
	) {
		if (!recruiter.canInteract())
			throw new HttpErrorException(
				'You can not performe the update action',
				401,
			);

		body.id = id;
		body.editor = recruiter.id;
		const result = await this.updateJobUseCase.execute(body);

		return result;
	}

	@Patch(':id/activate')
	@MustBeAuth()
	async activateJob(
		@LoggedRecruiter() recruiter: Recruiter,
		@Param('id') id: string,
		@Query('root') root: string,
	) {
		if (!root || root !== process.env.ROOT) {
			throw new HttpErrorException(
				'You can not consume this service. You are not root',
				403,
			);
		}

		const input: UpdateJobStatusInputDto = new UpdateJobStatusInputDto();
		input.id = id;
		input.editor = recruiter.id;
		input.status = Status.ACTIVATED;

		return this.updateJobStatusUseCase.execute(input);
	}

	@Patch(':id/deactivate')
	@MustBeAuth()
	async deactivateJob(
		@LoggedRecruiter() recruiter: Recruiter,
		@Param('id') id: string,
	) {
		if (!recruiter.canInteract())
			throw new HttpErrorException(
				'You can not performe the deactivation action',
				401,
			);

		const input: UpdateJobStatusInputDto = new UpdateJobStatusInputDto();
		input.id = id;
		input.editor = recruiter.id;
		input.status = Status.DEACTIVATED;

		return this.updateJobStatusUseCase.execute(input);
	}

	@Delete(':id/block')
	@MustBeAuth()
	async blockJob(
		@LoggedRecruiter() recruiter: Recruiter,
		@Param('id') id: string,
		@Query('root') root: string,
	) {
		if (!root || root !== process.env.ROOT) {
			throw new HttpErrorException(
				'You can not consume this service. You are not root',
				403,
			);
		}

		const input: UpdateJobStatusInputDto = new UpdateJobStatusInputDto();
		input.id = id;
		input.editor = recruiter.id ?? root;
		input.status = Status.BLOCKED;

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
