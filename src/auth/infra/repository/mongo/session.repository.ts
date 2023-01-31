import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationInterface } from '@/@shared/repository/pagination-interface';
import { Session } from '@/auth/domain';
import { SessionRepositoryInterface } from '@/auth/domain/repository/session.repository.interface';
import { Session as SessionEntity, SessionDocument } from './session.model';

@Injectable()
export class SessionMongoRepository implements SessionRepositoryInterface {
	constructor(
		@InjectModel(SessionEntity.name)
		private readonly sessionModel: Model<SessionDocument>,
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
		const session = await this.sessionModel.findOne({ token }).exec();
		return this.toDomain(session);
	}

	async findBySessionSubject(sub: string): Promise<Session> {
		const session = await this.sessionModel.findOne({ _id: sub }).exec();
		return this.toDomain(session);
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
