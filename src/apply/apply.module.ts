import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobFacade } from '@/job/facade/job.facade';
import { JobModule } from '@/job/job.module';
import { ApplyController } from './apply.controller';
import { ApplyFacade } from './facade/apply.facade';
import { Apply, ApplySchema } from './infra/repository/mongo/apply.model';
import { ApplyMongoRepository } from './infra/repository/mongo/apply.repository';
import { CreateApplyUseCase } from './usecase/create/create.usecase';
import { FindByJobIdUseCase } from './usecase/find-by-job-id/find-by-job-id-usecase';
import { ListAppliesUseCase } from './usecase/list/list.usecase';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Apply.name, schema: ApplySchema }]),
		forwardRef(() => JobModule),
	],
	providers: [
		ApplyMongoRepository,
		CreateApplyUseCase,
		ListAppliesUseCase,
		FindByJobIdUseCase,
		ApplyFacade,
		JobFacade,
	],
	controllers: [ApplyController],
	exports: [ApplyFacade, FindByJobIdUseCase],
})
export class ApplyModule {}
