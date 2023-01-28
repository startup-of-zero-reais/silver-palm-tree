import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateController } from './candidate.controller';
import {
  Candidate,
  CandidateSchema,
} from './infra/repository/mongo/candidate.model';
import CandidateMongoRepository from './infra/repository/mongo/candidate.repository';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';
import FindCandidateUsecase from './usecase/find/find.candidate.usecase';
import ListCandidateUseCase from './usecase/list/list.candidate.usecase';
import UpdateCandidateUseCase from './usecase/update/update.candidate.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
  ],
  controllers: [CandidateController],
  providers: [
    //repository
    CandidateMongoRepository,
    //usecase
    FindCandidateUsecase,
    UpdateCandidateUseCase,
    ListCandidateUseCase,
    CreateCandidateUseCase,
  ],
})
export class CandidateModule {}
