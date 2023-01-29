import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Response,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Response as eResponse } from 'express';
import { CreateInputDto, CreateOutputDto } from './usecase/create/create.dto';
import { CreateRecruiterUseCase } from './usecase/create/create.recruiter.usecase';

@Controller('recruiters')
export class RecruiterController {
  constructor(
    private readonly createRecruiterUseCase: CreateRecruiterUseCase,
  ) {}

  @Post()
  async create(@Body() input: CreateInputDto, @Response() response: eResponse) {
    try {
      const recruiter = await this.createRecruiterUseCase.execute(input);
      return response
        .status(HttpStatus.CREATED)
        .json(plainToClass(CreateOutputDto, recruiter));
    } catch (e) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: e.message });
    }
  }

  @Get()
  async list() {
    return true;
  }

  @Get(':id')
  async fetch() {
    return true;
  }

  @Put()
  async update() {
    return true;
  }
}
