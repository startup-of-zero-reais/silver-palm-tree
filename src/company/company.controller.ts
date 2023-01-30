import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Response,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Response as eResponse } from 'express';
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

@Controller('companies')
export class CompanyController {
	constructor(
		private readonly createCompanyUseCase: CreateCompanyUseCase,
		private readonly findCompanyUseCase: FindCompanyUseCase,
	) {}

	@Post()
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
}
