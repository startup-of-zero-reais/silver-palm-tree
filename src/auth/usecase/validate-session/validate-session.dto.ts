import { Transform, Exclude, Expose, plainToClass } from 'class-transformer';

export class PayloadDto {
	type: 'candidate' | 'recruiter' | 'both';
	/** @property rid - is the id of the recruiter session */
	rid?: string;
	/** @property sub - is the id of the candidate */
	cid?: string;
	iat: number;
	exp: number;
	aud: 'recruiter' | 'candidate' | 'both';
	iss: string;
	/** @property sub - is the base64 encoded ids */
	sub: string;
}

@Exclude()
class CommonPropsDto {
	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	email: string;

	@Expose()
	image: string;
}

@Exclude()
export class CandidateSessionOutputDto extends CommonPropsDto {}

@Exclude()
export class RecruiterSessionOutputDto extends CommonPropsDto {}

@Exclude()
export class SessionOutputDto {
	@Expose()
	candidate?: CandidateSessionOutputDto;

	@Expose()
	recruiter?: RecruiterSessionOutputDto;
}
