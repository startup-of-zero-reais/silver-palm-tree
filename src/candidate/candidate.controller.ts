import { Body, Controller, HttpStatus, Post, Response } from '@nestjs/common';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';
import { Create } from './usecase/create/create.dto';
import { Response as eResponse } from 'express';
import NotificationError from 'src/@shared/notification/notification.error';

@Controller('candidate')
export class CandidateController {
  constructor(
    private readonly createCandidateUseCase: CreateCandidateUseCase,
  ) {}

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
