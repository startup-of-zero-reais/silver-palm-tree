import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import Candidate from '@/candidate/domain/entity/candidate.entity';
import { Recruiter } from '@/recruiter/domain';

export class LoginInputDto {
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({ type: String, example: 'foo@bar.com' })
	email: string;

	@IsNotEmpty()
	@ApiProperty({ type: String, example: '123456' })
	password: string;
}

export class LoginOkDto {
	candidate: Candidate;
	recruiter: Recruiter;
}

@Exclude()
export class LoginOutputDto {
	@Expose()
	name: string;

	@Expose()
	email: string;
}

export function userToJson(user: Candidate | any) {
	return plainToClass(LoginOutputDto, user, {
		excludeExtraneousValues: true,
	});
}
