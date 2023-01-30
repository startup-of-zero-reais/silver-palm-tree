import { Body, Controller, HttpStatus, Post, Response } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Response as eResponse } from 'express';
import { CreateCompanyUseCase } from './usecase/create.company.usecase';
import {
	CreateCompanyInputDto,
	CreateCompanyOutputDto,
} from './usecase/create.dto';

@Controller('companies')
export class CompanyController {
	constructor(private readonly createCompanyUseCase: CreateCompanyUseCase) {}

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
}
