import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Response,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Response as eResponse } from 'express';
import { LoggedCandidate, MustBeAuth } from '@/@shared/decorator';
import NotificationError from '@/@shared/notification/notification.error';
import { Candidate } from './domain';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';
import {
	CreateCandidateInputDto,
	CreateCandidateOutputDto,
} from './usecase/create/create.dto';
import FindCandidateUsecase from './usecase/find/find.candidate.usecase';
import { FindOutputDto } from './usecase/find/find.dto';
import ListCandidateUseCase from './usecase/list/list.candidate.usecase';
import {
	UpdateCandidateInputDto,
	UpdateCandidateOutputDto,
} from './usecase/update/update.candidate.dto';
import UpdateCandidateUseCase from './usecase/update/update.candidate.usecase';

@Controller('candidates')
export class CandidateController {
	constructor(
		private readonly createCandidateUseCase: CreateCandidateUseCase,
		private readonly findCandidateUseCase: FindCandidateUsecase,
		private readonly listCandidateUseCase: ListCandidateUseCase,
		private readonly updateCandidateUseCase: UpdateCandidateUseCase,
	) {}

	@Get('/me')
	@MustBeAuth()
	async findOne(
		@LoggedCandidate() candidate: Candidate,
		@Response() response: eResponse,
	) {
		try {
			const output = await this.findCandidateUseCase.execute({
				id: candidate.id,
			});

			return response
				.status(HttpStatus.OK)
				.json(plainToClass(FindOutputDto, output));
		} catch (error) {
			if (error instanceof NotificationError) {
				return response
					.status(HttpStatus.UNPROCESSABLE_ENTITY)
					.json(error);
			}

			return response.status(error.response.statusCode).json({
				message: error.response.message,
			});
		}
	}

	@Get(':id')
	async findById(@Param('id') candidateId: string) {
		const output = await this.findCandidateUseCase.execute({
			id: candidateId,
		});

		return plainToClass(FindOutputDto, output);
	}

	@Get()
	@MustBeAuth()
	async list(@Response() response: eResponse, @Query() query) {
		try {
			const output = await this.listCandidateUseCase.execute({
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
				.json(error);
		}
	}

	@Post()
	async create(
		@Body() createCandidateDto: CreateCandidateInputDto,
		@Response() response: eResponse,
	) {
		const output = await this.createCandidateUseCase.execute(
			createCandidateDto,
		);

		return response
			.status(HttpStatus.CREATED)
			.json(plainToClass(CreateCandidateOutputDto, output));
	}

	@Put()
	@MustBeAuth()
	async update(
		@Body() updateCandidateDto: UpdateCandidateInputDto,
		@LoggedCandidate() candidate: Candidate,
		@Response() response: eResponse,
	) {
		try {
			updateCandidateDto.id = candidate.id;
			const output = await this.updateCandidateUseCase.execute(
				updateCandidateDto,
			);

			return response
				.status(HttpStatus.OK)
				.json(plainToClass(UpdateCandidateOutputDto, output));
		} catch (error) {
			if (error instanceof NotificationError) {
				return response
					.status(HttpStatus.UNPROCESSABLE_ENTITY)
					.json(error);
			}
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json(error);
		}
	}
}
