import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Response,
} from '@nestjs/common';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';
import { Create } from './usecase/create/create.dto';
import { Response as eResponse } from 'express';
import NotificationError from 'src/@shared/notification/notification.error';
import FindCandidateUsecase from './usecase/find/find.candidate.usecase';
import ListCandidateUseCase from './usecase/list/list.candidate.usecase';

@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly createCandidateUseCase: CreateCandidateUseCase,
    private readonly findCandidateUseCase: FindCandidateUsecase,
    private readonly listCandidateUseCase: ListCandidateUseCase,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string, @Response() response: eResponse) {
    try {
      const output = await this.findCandidateUseCase.execute({ id: id });
      return response.status(HttpStatus.OK).json(output);
    } catch (error) {
      if (error instanceof NotificationError) {
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Get()
  async list(@Response() response: eResponse) {
    try {
      const output = await this.listCandidateUseCase.execute();
      return response.status(HttpStatus.OK).json(output);
    } catch (error) {
      if (error instanceof NotificationError) {
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }

  @Post()
  async create(
    @Body() createCandidateDto: Create.Input,
    @Response() response: eResponse,
  ) {
    try {
      const output = await this.createCandidateUseCase.execute(
        createCandidateDto,
      );
      return response.status(HttpStatus.CREATED).json(output);
    } catch (error) {
      if (error instanceof NotificationError) {
        return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(error);
      }
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
