import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	Response,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Response as eResponse } from 'express';
import NotificationError from '@/@shared/notification/notification.error';
import { ListRecruiterUseCase } from './list/list.recruiter.usecase';
import { CreateInputDto, CreateOutputDto } from './usecase/create/create.dto';
import { CreateRecruiterUseCase } from './usecase/create/create.recruiter.usecase';
import { DeleteRecruiterInputDto } from './usecase/delete/delete.recruiter.dto';
import { DeleteRecruiterUseCase } from './usecase/delete/delete.recruiter.usecase';
import {
	FindRecruiterInputDto,
	FindRecruiterOutputDto,
} from './usecase/find/find.recruiter.dto';
import { FindRecruiterUseCase } from './usecase/find/find.recruiter.usecase';
import {
	UpdateRecruiterInputDto,
	UpdateRecruiterOutputDto,
} from './usecase/update/update.dto';
import { UpdateRecruiterUseCase } from './usecase/update/update.recruiter.usecase';

@Controller('recruiters')
export class RecruiterController {
	constructor(
		private readonly createRecruiterUseCase: CreateRecruiterUseCase,
		private readonly findRecruiterUseCase: FindRecruiterUseCase,
		private readonly updateRecruiterUseCase: UpdateRecruiterUseCase,
		private readonly listRecruiterUseCase: ListRecruiterUseCase,
		private readonly deleteRecruiterUseCase: DeleteRecruiterUseCase,
	) {}

	@Post()
	async create(
		@Body() input: CreateInputDto,
		@Response() response: eResponse,
	) {
		try {
			const recruiter = await this.createRecruiterUseCase.execute(input);
			return response
				.status(HttpStatus.CREATED)
				.json(plainToClass(CreateOutputDto, recruiter));
		} catch (e) {
			if (e instanceof NotFoundException) {
				return response
					.status(HttpStatus.NOT_FOUND)
					.json({ error: e.message });
			}
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: e.message });
		}
	}

	@Get(':id')
	async fetch(
		@Param('id') recruiterID: string,
		@Response() response: eResponse,
	) {
		try {
			const input = new FindRecruiterInputDto();
			input.id = recruiterID;

			const recruiter = await this.findRecruiterUseCase.execute(input);

			return response
				.status(HttpStatus.OK)
				.json(plainToClass(FindRecruiterOutputDto, recruiter));
		} catch (e) {
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: e.message });
		}
	}

	@Put(':id')
	async update(
		@Param('id') recruiterID: string,
		@Body() updateRecruiterInputDto: UpdateRecruiterInputDto,
		@Response() response: eResponse,
	) {
		try {
			updateRecruiterInputDto.id = recruiterID;

			const recruiter = await this.updateRecruiterUseCase.execute(
				updateRecruiterInputDto,
			);

			return response
				.status(HttpStatus.OK)
				.json(plainToClass(UpdateRecruiterOutputDto, recruiter));
		} catch (e) {
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: e.message });
		}
	}

	@Get()
	async list(@Response() response: eResponse, @Query() query) {
		try {
			const output = await this.listRecruiterUseCase.execute({
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

	@Delete(':id')
	async delete(
		@Param('id') recruiterID: string,
		@Response() response: eResponse,
	) {
		try {
			const deleteRecruiterInputDto = new DeleteRecruiterInputDto();
			deleteRecruiterInputDto.id = recruiterID;

			await this.deleteRecruiterUseCase.execute(deleteRecruiterInputDto);

			return response.status(HttpStatus.NO_CONTENT).send();
		} catch (e) {
			return response
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ error: e.message });
		}
	}
}
