import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobAdCreatedListener } from './infra/listeners/jobad-created.listener';
import {
	JobAd,
	JobAdSchema,
	JobAdView,
	JobAdViewSchema,
} from './infra/repository/mongo/job-ad.model';
import { JobAdMongoRepository } from './infra/repository/mongo/job-ad.repository';
import { JobController } from './job.controller';
import { CreateJobUseCase } from './usecase/create/create.usecase';
import { FindJobUseCase } from './usecase/find/find.job.usecase';

@Module({
	imports: [
		// schemas
		MongooseModule.forFeature([{ name: JobAd.name, schema: JobAdSchema }]),
		MongooseModule.forFeature([
			{ name: JobAdView.name, schema: JobAdViewSchema },
		]),
	],
	controllers: [JobController],
	providers: [
		// repositories
		JobAdMongoRepository,
		// services
		CreateJobUseCase,
		FindJobUseCase,
		// event listeners
		JobAdCreatedListener,
	],
})
export class JobModule {}
