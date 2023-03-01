import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobModule } from '@/job/job.module';
import { ApplyController } from './apply.controller';
import { Apply, ApplySchema } from './infra/repository/mongo/apply.model';
import { ApplyMongoRepository } from './infra/repository/mongo/apply.repository';
import { CreateApplyUseCase } from './usecase/create/create.usecase';
import { ListAppliesUseCase } from './usecase/list/list.usecase';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Apply.name, schema: ApplySchema }]),
		JobModule,
	],
	providers: [ApplyMongoRepository, CreateApplyUseCase, ListAppliesUseCase],
	controllers: [ApplyController],
})
export class ApplyModule {}
