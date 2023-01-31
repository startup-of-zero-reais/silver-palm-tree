import Session from '../entity/session.entity';

export interface SessionRepositoryInterface {
	create(s: Session): Promise<void>;
	findByToken(token: string): Promise<Session>;
	findBySessionSubject(sub: string): Promise<Session>;
}
