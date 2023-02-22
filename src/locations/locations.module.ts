import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '@/@shared/protocol/http/http.client';
import { JobModule } from '@/job/job.module';
import { ViaCepRepository } from './infra/repository/viacep/viacep.repository';
import { LocationsController } from './locations.controller';
import { ListUseCase } from './usecase/list/list.usecase';
import { SearchUseCase } from './usecase/search/search.usecase';

@Module({
	imports: [JobModule],
	controllers: [LocationsController],
	providers: [
		{
			provide: HttpClient,
			useFactory: (config: ConfigService) =>
				new HttpClient(config.get<string>('CEP_WEBSERVICE')),
			inject: [ConfigService],
		},
		SearchUseCase,
		ListUseCase,
		ViaCepRepository,
	],
})
export class LocationsModule {}
