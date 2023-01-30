import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CandidateModule } from './candidate/candidate.module';
import { CompanyModule } from './company/company.module';
import { RecruiterModule } from './recruiter/recruiter.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
