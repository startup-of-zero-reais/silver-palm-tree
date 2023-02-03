import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Session } from '@/auth/domain';
import { SessionMongoRepository } from '@/auth/infra/repository/mongo/session.repository';
import { LoginOkDto } from '../login/login.dto';

@Injectable()
export class ManageSessionToken {
	constructor(
		private config: ConfigService,
		private jwtService: JwtService,
		private readonly sessionRepository: SessionMongoRepository,
	) {}

	public async newSessionToken(user: LoginOkDto): Promise<string> {
		const type = getTypeFrom(user);

		if (type === 'unknown') {
			throw new Error('can not identify user type');
		}

		const recruiterID = user.recruiter?.id || 'None';
		const candidateID = user.candidate?.id || 'None';

		const subject = Buffer.from(`${candidateID}:${recruiterID}`).toString(
			'base64',
		);

		const session = await this.sessionRepository.findBySessionSubject(
			subject,
		);

		await this.sessionRepository.clearExpiredSessions();

		if (session) {
			return session.token;
		}

		const token = this.jwtService.sign(
			{
				type,
				rid: recruiterID,
				cid: candidateID,
			},
			{
				issuer: this.config.get('ISSUER'),
				secret: this.config.get('SECRET'),
				expiresIn: this.config.get('SESSION_TIME'),
				audience: type,
				subject: subject,
			},
		);

		await this.sessionRepository.create(
			new Session({
				id: subject,
				token,
				cid: candidateID,
				rid: recruiterID,
			}),
		);

		return token;
	}
}

type Types = 'unknown' | 'candidate' | 'both' | 'recruiter';

function getTypeFrom(user: LoginOkDto): Types {
	let type: Types = 'unknown';

	if (typeof user.candidate !== 'undefined') {
		type = 'candidate';
	}

	if (typeof user.recruiter !== 'undefined') {
		if (type === 'candidate') return 'both' as const;

		type = 'recruiter';
	}

	return type;
}
