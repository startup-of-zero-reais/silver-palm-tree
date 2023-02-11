import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobAdEventListener } from './infra/listeners/jobad-event.listener';
import {
	JobAd,
	JobAdSchema,
	JobAdView,
	JobAdViewSchema,
} from './infra/repository/mongo/job-ad.model';
import { JobAdMongoRepository } from './infra/repository/mongo/job-ad.repository';
import { JobController } from './job.controller';
import { CreateJobUseCase } from './usecase/create/create.usecase';
import { FindJobByIDUseCase } from './usecase/find-by-id/find-by-id.job.usecase';
import { UpdateJobStatusUseCase } from './usecase/update-job-status/update-job-status.usecase';

@Module({
	imports: [
		MongooseModule.forFeature([
			// entity
			{ name: JobAd.name, schema: JobAdSchema },
			// view
			{ name: JobAdView.name, schema: JobAdViewSchema },
		]),
	],
	controllers: [JobController],
	providers: [
		// repositories
		JobAdMongoRepository,
		// services
		CreateJobUseCase,
		FindJobByIDUseCase,
		UpdateJobStatusUseCase,
		// event listeners
		JobAdEventListener,
	],
})
export class JobModule {}
