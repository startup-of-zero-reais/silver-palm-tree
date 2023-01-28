import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateController } from './candidate.controller';
import { CANDIDATE_PROVIDERS } from './candidate.provider';
import {
  Candidate,
  CandidateSchema,
} from './infra/repository/mongo/candidate.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidate.name, schema: CandidateSchema },
    ]),
  ],
  controllers: [CandidateController],
  providers: [
    ...Object.values(CANDIDATE_PROVIDERS.REPOSITORIES),
    ...Object.values(CANDIDATE_PROVIDERS.USE_CASES),
  ],
})
export class CandidateModule {}
