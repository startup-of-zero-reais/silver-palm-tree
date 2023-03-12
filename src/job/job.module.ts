import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplyModule } from '@/apply/apply.module';
import { ApplyFacade } from '@/apply/facade/apply.facade';
import { CandidateModule } from '@/candidate/candidate.module';
import { JobFacade } from './facade/job.facade';
import { JobAdEventListener } from './infra/listeners/jobad-event.listener';
import {
	JobAd,
	JobAdSchema,
	JobAdView,
	JobAdViewSchema,
} from './infra/repository/mongo/job-ad.model';
import { JobAdMongoRepository } from './infra/repository/mongo/job-ad.repository';
import { JobController } from './job.controller';
import { AppliesUseCase } from './usecase/applies/applies.usecase';
import { CreateJobUseCase } from './usecase/create/create.usecase';
import { FindJobByIDUseCase } from './usecase/find-by-id/find-by-id.job.usecase';
import { ListJobsUseCase } from './usecase/list/list.usecase';
import { RefreshJobUseCase } from './usecase/refresh/refresh.usecase';
import { UpdateJobStatusUseCase } from './usecase/update-job-status/update-job-status.usecase';
import { UpdateUseCase } from './usecase/update/update.usecase';

@Module({
	imports: [
		MongooseModule.forFeature([
			// entity
			{ name: JobAd.name, schema: JobAdSchema },
			// view
			{ name: JobAdView.name, schema: JobAdViewSchema },
		]),
		forwardRef(() => ApplyModule),
		forwardRef(() => CandidateModule),
	],
	controllers: [JobController],
	providers: [
		// repositories
		JobAdMongoRepository,
		// services
		CreateJobUseCase,
		FindJobByIDUseCase,
		UpdateUseCase,
		UpdateJobStatusUseCase,
		ListJobsUseCase,
		AppliesUseCase,
		RefreshJobUseCase,
		// event listeners
		JobAdEventListener,
		// facade
		JobFacade,
		ApplyFacade,
	],
	exports: [
		MongooseModule,
		JobAdMongoRepository,
		JobFacade,
		FindJobByIDUseCase,
		ListJobsUseCase,
	],
})
export class JobModule {}
