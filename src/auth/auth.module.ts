import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CacheManager } from '@/@shared/repository/cache.repository';
import { CandidateModule } from '@/candidate/candidate.module';
import CandidateFacade from '@/candidate/facade/candidate.facade';
import { RecruiterFacade } from '@/recruiter/facade/recruiter.facade';
import { RecruiterModule } from '@/recruiter/recruiter.module';
import { AuthController } from './auth.controller';
import { Session, SessionSchema } from './infra/repository/mongo/session.model';
import { SessionMongoRepository } from './infra/repository/mongo/session.repository';
import { JwtStrategy } from './usecase/authorization-strategy/jwt.strategy';
import { AuthTokenGuard } from './usecase/authorization-strategy/token.guard';
import { LocalAuthGuard } from './usecase/do-login-strategy/local-auth.guard';
import { LocalStrategy } from './usecase/do-login-strategy/local.strategy';
import { LoginUseCase } from './usecase/login/login.usecase';
import { LogoutUseCase } from './usecase/logout/logout.usecase';
import { ManageSessionToken } from './usecase/manage-session-token/manage-session-token.usecase';
import { ValidateSessionUseCase } from './usecase/validate-session/validate-session.usecase';

@Module({
	imports: [
		CandidateModule,
		RecruiterModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => {
				return {
					secret: config.get('SESSION_SECRET'),
					signOptions: {
						issuer: config.get('ISSUER'),
						expiresIn: config.get('SESSION_TIME'),
					},
				};
			},
			inject: [ConfigService],
		}),
		MongooseModule.forFeature([
			{ name: Session.name, schema: SessionSchema },
		]),
	],
	providers: [
		// repositories
		SessionMongoRepository,
		CacheManager,
		// facades
		CandidateFacade,
		RecruiterFacade,
		// auth providers
		ManageSessionToken,
		LoginUseCase,
		ValidateSessionUseCase,
		LogoutUseCase,
		// guard strategies
		LocalStrategy,
		LocalAuthGuard,
		JwtStrategy,
		AuthTokenGuard,
	],
	controllers: [AuthController],
})
export class AuthModule {}
