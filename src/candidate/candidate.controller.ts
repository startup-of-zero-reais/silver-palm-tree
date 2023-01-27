import { Body, Controller, Post, Response } from '@nestjs/common';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';
import { Create } from './usecase/create/create.dto';
import { Response as eResponse } from 'express';

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
      return response.status(201).json(output);
    } catch (error) {
      return response.status(500).json(error);
    }
  }
}
