import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Candidate } from '@/candidate/domain';
import { Recruiter } from '@/recruiter/domain';
import { LoginOkDto } from '../login/login.dto';

@Injectable()
export class ManageSessionToken {
	constructor(
		private config: ConfigService,
		private jwtService: JwtService,
	) {}

	public async newSessionToken(user: LoginOkDto): Promise<string> {
		const type = getTypeFrom(user);

		if (type === 'unknown') {
			throw new Error('can not identify user type');
		}

		const recruiterID = user.recruiter?.id || 'None';
		const candidateID = user.candidate?.id || 'None';

		const subject = Buffer.from(`${recruiterID}:${candidateID}`).toString(
			'base64',
		);

		return this.jwtService.sign(
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
