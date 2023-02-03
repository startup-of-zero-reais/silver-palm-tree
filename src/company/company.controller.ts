import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Put,
	Query,
	Response,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Response as eResponse } from 'express';
import { MustBeAuth } from '@/@shared/decorator';
import NotificationError from '@/@shared/notification/notification.error';
import { CreateCompanyUseCase } from './usecase/create/create.company.usecase';
import {
	CreateCompanyInputDto,
	CreateCompanyOutputDto,
} from './usecase/create/create.dto';
import { FindCompanyUseCase } from './usecase/find/find.company.usecase';
import {
	FindCompanyInputDto,
	FindCompanyOutputDto,
} from './usecase/find/find.dto';
import { ListCompanyUseCase } from './usecase/list/list.company.usecase';
import {
	UpdateStatusCompanyInputDto,
	UpdateStatusCompanyOutputDto,
} from './usecase/update-status/update-status.company.dto';
import { UpdateStatusCompanyUseCase } from './usecase/update-status/update-status.company.usecase';
import {
	UpdateCompanyInputDto,
	UpdateCompanyOutputDto,
} from './usecase/update/update-company.dto';
import { UpdateCompanyUseCase } from './usecase/update/update.company.usecase';

@Controller('companies')
export class CompanyController {
	constructor(
		private readonly createCompanyUseCase: CreateCompanyUseCase,
		private readonly findCompanyUseCase: FindCompanyUseCase,
		private readonly listCompanyUseCase: ListCompanyUseCase,
		private readonly updateStatusCompanyUseCase: UpdateStatusCompanyUseCase,
		private readonly updateCompanyUseCase: UpdateCompanyUseCase,
	) {}

	@Post()
	@MustBeAuth()
	async create(
		@Body() input: CreateCompanyInputDto,
		@Response() response: eResponse,
	) {
		try {
			const recruiter = await this.createCompanyUseCase.execute(input);

			return response
				.status(HttpStatus.CREATED)
				.json(plainToClass(CreateCompanyOutputDto, recruiter));
		} catch (e) {
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: e.message });
		}
	}

	@Put(':id')
	async update(
		@Param('id') companyID: string,
		@Body() updateCompanyInputDto: UpdateCompanyInputDto,
		@Response() response: eResponse,
	) {
		updateCompanyInputDto.id = companyID;
		const recruiter = await this.updateCompanyUseCase.execute(
			updateCompanyInputDto,
		);
		return response
			.status(HttpStatus.CREATED)
			.json(plainToClass(UpdateCompanyOutputDto, recruiter));
	}

	@Get(':id')
	async fetch(
		@Param('id') companyID: string,
		@Response() response: eResponse,
	) {
		try {
			const input = new FindCompanyInputDto();
			input.id = companyID;

			const company = await this.findCompanyUseCase.execute(input);

			return response
				.status(HttpStatus.OK)
				.json(plainToClass(FindCompanyOutputDto, company));
		} catch (e) {
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: e.message });
		}
	}

	@Patch(':id')
	async updateStatus(
		@Param('id') companyID: string,
		@Body() updateStatusCompanyInputDto: UpdateStatusCompanyInputDto,
		@Response() response: eResponse,
	) {
		updateStatusCompanyInputDto.id = companyID;
		const recruiter = await this.updateStatusCompanyUseCase.execute(
			updateStatusCompanyInputDto,
		);
		return response
			.status(HttpStatus.CREATED)
			.json(plainToClass(UpdateStatusCompanyOutputDto, recruiter));
	}

	@Get()
	async list(@Response() response: eResponse, @Query() query) {
		try {
			const output = await this.listCompanyUseCase.execute({
				page: query.page,
				page_size: query.page_size,
			});
			return response.status(HttpStatus.OK).json(output);
		} catch (error) {
			if (error instanceof NotificationError) {
				return response
					.status(HttpStatus.UNPROCESSABLE_ENTITY)
					.json(error);
			}
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: error.message });
		}
	}
}
