import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Candidate,
  CandidateDocument,
} from './infra/repository/typeorm/candidate.model';
import CandidateMongoRepository from './infra/repository/typeorm/candidate.repository';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';
import FindCandidateUsecase from './usecase/find/find.candidate.usecase';
import ListCandidateUseCase from './usecase/list/list.candidate.usecase';

export namespace CANDIDATE_PROVIDERS {
  export namespace REPOSITORIES {
    export const CANIDADATE_TYPEORM_REPOSITORY = {
      provide: CandidateMongoRepository,
      useFactory: (candidateModel: Model<CandidateDocument>) => {
        return new CandidateMongoRepository(candidateModel);
      },
      inject: [getModelToken(Candidate.name)],
    };
  }
  export namespace USE_CASES {
    export const CREATE_CATEGORY_USECASE = {
      provide: CreateCandidateUseCase,
      useFactory: (candidateRepo: CandidateMongoRepository) => {
        return new CreateCandidateUseCase(candidateRepo);
      },
      inject: [CandidateMongoRepository],
    };
    export const FIND_CANDIDATE_USECASE = {
      provide: FindCandidateUsecase,
      useFactory: (candidateRepo: CandidateMongoRepository) => {
        return new FindCandidateUsecase(candidateRepo);
      },
      inject: [CandidateMongoRepository],
    };
    export const FIND_ALL_CANDIDATE_USECASE = {
      provide: ListCandidateUseCase,
      useFactory: (candidateRepo: CandidateMongoRepository) => {
        return new ListCandidateUseCase(candidateRepo);
      },
      inject: [CandidateMongoRepository],
    };
  }
}
