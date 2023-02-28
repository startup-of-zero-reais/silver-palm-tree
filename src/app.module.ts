import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { MainExceptionFilter } from './@shared/exception-filter/http-exception.filter';
import { HttpClient } from './@shared/protocol/http/http.client';
import {
	CacheManager,
	cacheTicker,
} from './@shared/repository/cache.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CandidateModule } from './candidate/candidate.module';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { LocationsModule } from './locations/locations.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { FiltersModule } from './filters/filters.module';
import { ApplyModule } from './apply/apply.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		EventEmitterModule.forRoot(),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URI'),
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		CandidateModule,
		RecruiterModule,
		CompanyModule,
		JobModule,
		LocationsModule,
		FiltersModule,
		ApplyModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: MainExceptionFilter,
		},
		AppService,
		CacheManager,
	],
	exports: [CacheManager],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
	private cacheManager: () => void;

	onModuleInit() {
		this.cacheManager = cacheTicker();
	}

	onModuleDestroy() {
		this.cacheManager();
	}
}
