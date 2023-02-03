import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { subSeconds } from 'date-fns';
import { Model } from 'mongoose';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import { parseTime } from '@/@shared/helpers/parse-time';
import { CacheManager } from '@/@shared/repository/cache.repository';
import { Session } from '@/auth/domain';
import { SessionRepositoryInterface } from '@/auth/domain/repository/session.repository.interface';
import { Session as SessionEntity, SessionDocument } from './session.model';

@Injectable()
export class SessionMongoRepository implements SessionRepositoryInterface {
	constructor(
		@InjectModel(SessionEntity.name)
		private readonly sessionModel: Model<SessionDocument>,

		@Inject(CacheManager)
		private readonly cache: CacheManager,
	) {}

	async create(entity: Session): Promise<void> {
		await this.sessionModel.create({
			_id: entity.id,
			token: entity.token,
			cid: entity.cid || 'None',
			rid: entity.rid || 'None',
			createdAt: entity.createdAt,
		});
	}

	async findByToken(token: string): Promise<Session> {
		const value = await this.cache.get<Session>(token);

		console.log('Value', value);

		if (!value) {
			const session = await this.sessionModel
				.findOne({
					token,
					createdAt: {
						// createdAt should be greather than session time past
						// It means the session already is valid
						$gte: subSeconds(
							new Date(),
							parseTime(process.env.SESSION_TIME),
						),
						$lte: new Date(),
					},
				})
				.exec();

			if (!session)
				throw new HttpErrorException(
					'invalid session',
					HttpStatus.UNAUTHORIZED,
				);

			const domainSession = this.toDomain(session);
			await this.cache.set(session.token, domainSession, 30);
			return domainSession;
		}

		return value;
	}

	async findBySessionSubject(sub: string): Promise<Session> {
		const value = await this.cache.get<Session>(sub);

		if (!value) {
			const session = await this.sessionModel
				.findOne({
					_id: sub,
					createdAt: {
						// createdAt should be greather than session time past
						// It means the session already is valid
						$gte: subSeconds(
							new Date(),
							parseTime(process.env.SESSION_TIME),
						),
						$lte: new Date(),
					},
				})
				.exec();

			const domainSession = this.toDomain(session);
			await this.cache.set(sub, domainSession, 30);
			return domainSession;
		}

		return value;
	}

	async clearExpiredSessions() {
		await this.sessionModel
			.deleteMany({
				createdAt: {
					// when session time is lower than past time
					// means the session is invalid
					$lte: subSeconds(
						new Date(),
						parseTime(process.env.SESSION_TIME),
					),
				},
			})
			.exec();
	}

	async invalidateSession(token: string): Promise<void> {
		await this.sessionModel.deleteOne({ token }).exec();
		await this.cache.del(token);
	}

	private toDomain(sessionObject: any): Session {
		if (!sessionObject) return;

		return new Session({
			id: sessionObject._id,
			token: sessionObject.token,
			cid: sessionObject.cid,
			rid: sessionObject.rid,
			createdAt: sessionObject.createdAt,
		});
	}
}
