import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from '@/company/company.module';
import {
	Company,
	CompanySchema,
} from '@/company/infra/repository/mongo/company.model';
import { RecruiterFacade } from './facade/recruiter.facade';
import {
	Recruiter,
	RecruiterSchema,
} from './infra/repository/mongo/recruiter.model';
import RecruiterMongoRepository from './infra/repository/mongo/recruiter.repository';
import { RecruiterController } from './recruiter.controller';
import { CreateRecruiterUseCase } from './usecase/create/create.recruiter.usecase';
import { DeleteRecruiterUseCase } from './usecase/delete/delete.recruiter.usecase';
import { FindByEmailRecruiterUseCase } from './usecase/find-by-email/find-by-email.recruiter.usecase';
import { FindRecruiterUseCase } from './usecase/find/find.recruiter.usecase';
import { ListRecruiterUseCase } from './usecase/list/list.recruiter.usecase';
import { UpdateStatusRecruiterUseCase } from './usecase/update-status/update-status.usecase';
import { UpdateRecruiterUseCase } from './usecase/update/update.recruiter.usecase';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Company.name, schema: CompanySchema },
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
		UpdateRecruiterUseCase,
		ListRecruiterUseCase,
		DeleteRecruiterUseCase,
		UpdateStatusRecruiterUseCase,
		// facade
		RecruiterFacade,
	],
	exports: [
		FindRecruiterUseCase,
		FindByEmailRecruiterUseCase,
		RecruiterFacade,
	],
	controllers: [RecruiterController],
})
export class RecruiterModule {}
