import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyFacade } from './facade/company.facade';
import { Company, CompanySchema } from './infra/repository/mongo/company.model';
import { CompanyMongoRepository } from './infra/repository/mongo/company.repository';
import { CreateCompanyUseCase } from './usecase/create.company.usecase';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Company.name, schema: CompanySchema },
		]),
	],
	providers: [
		// FACADE
		CompanyFacade,
		// USECASE
		CreateCompanyUseCase,
		//REPOSITORY
		CompanyMongoRepository,
	],
	controllers: [CompanyController],
	exports: [CompanyFacade],
})
export class CompanyModule {}
