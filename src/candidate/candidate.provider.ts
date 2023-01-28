import { FactoryProvider } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CandidateFacade from './facade/candidate.facade';
import {
  Candidate,
  CandidateDocument,
} from './infra/repository/mongo/candidate.model';
import CandidateMongoRepository from './infra/repository/mongo/candidate.repository';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';
import FindCandidateByEmailUsecase from './usecase/find-by-email/find-by-email.candidate.usecase';
import FindCandidateUsecase from './usecase/find/find.candidate.usecase';
import ListCandidateUseCase from './usecase/list/list.candidate.usecase';
import UpdateCandidateUseCase from './usecase/update/update.candidate.usecase';

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

    export const FIND_CANDIDATE_BY_EMAIL_USECASE = {
      provide: FindCandidateByEmailUsecase,
      useFactory: (candidateRepo: CandidateMongoRepository) => {
        return new FindCandidateByEmailUsecase(candidateRepo);
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

    export const UPDATE_CANDIDATE_USECASE = {
      provide: UpdateCandidateUseCase,
      useFactory: (candidateRepo: CandidateMongoRepository) => {
        return new UpdateCandidateUseCase(candidateRepo);
      },
      inject: [CandidateMongoRepository],
    };
  }

  export namespace FACADE {
    export const CANDIDATE_FACADE: FactoryProvider = {
      provide: CandidateFacade,
      useFactory: (
        findCandidateByEmailUseCase: FindCandidateByEmailUsecase,
      ) => {
        return new CandidateFacade(findCandidateByEmailUseCase);
      },
      inject: [FindCandidateByEmailUsecase],
    };
  }
}
