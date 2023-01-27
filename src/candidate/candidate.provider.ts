import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Candidate,
  CandidateDocument,
} from './infra/repository/typeorm/candidate.model';
import CandidateMongoRepository from './infra/repository/typeorm/candidate.repository';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';

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
  }
}
