import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateController } from './candidate.controller';
import CandidateFacade from './facade/candidate.facade';
import {
	Candidate,
	CandidateSchema,
} from './infra/repository/mongo/candidate.model';
import CandidateMongoRepository from './infra/repository/mongo/candidate.repository';
import CreateCandidateUseCase from './usecase/create/create.candidate.usecase';
import FindCandidateByEmailUsecase from './usecase/find-by-email/find-by-email.candidate.usecase';
import { FindByIdsUseCase } from './usecase/find-by-ids/find-by-ids.candidate.usecase';
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
		FindCandidateByEmailUsecase,
		UpdateCandidateUseCase,
		ListCandidateUseCase,
		CreateCandidateUseCase,
		FindByIdsUseCase,
		// facade
		CandidateFacade,
	],
	exports: [
		FindCandidateUsecase,
		FindCandidateByEmailUsecase,
		FindByIdsUseCase,
		CandidateFacade,
	],
})
export class CandidateModule {}
