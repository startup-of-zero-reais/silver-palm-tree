import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from '@/company/company.module';
import { RecruiterFacade } from './facade/recruiter.facade';
import {
  Recruiter,
  RecruiterSchema,
} from './infra/repository/mongo/recruiter.model';
import RecruiterMongoRepository from './infra/repository/mongo/recruiter.repository';
import { RecruiterController } from './recruiter.controller';
import { CreateRecruiterUseCase } from './usecase/create/create.recruiter.usecase';
import { FindByEmailRecruiterUseCase } from './usecase/find-by-email/find-by-email.recruiter.usecase';
import { FindRecruiterUseCase } from './usecase/find/find.recruiter.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recruiter.name, schema: RecruiterSchema },
    ]),
    CompanyModule,
  ],
  providers: [
    // repositories
    RecruiterMongoRepository,
    // services
    CreateRecruiterUseCase,
    FindRecruiterUseCase,
    FindByEmailRecruiterUseCase,
    // facade
    RecruiterFacade,
  ],
  exports: [RecruiterFacade],
  controllers: [RecruiterController],
})
export class RecruiterModule {}
