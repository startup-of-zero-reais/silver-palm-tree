import { Module } from '@nestjs/common';
import { JobModule } from '@/job/job.module';
import { FiltersController } from './filters.controller';
import { FiltersMongoRepository } from './infra/repository/mongo/filters.repository';
import { ListFiltersUseCase } from './usecase/list/list.usecase';

@Module({
	imports: [JobModule],
	controllers: [FiltersController],
	providers: [FiltersMongoRepository, ListFiltersUseCase],
})
export class FiltersModule {}
