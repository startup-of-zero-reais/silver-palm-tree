import {
	Controller,
	Get,
	HttpStatus,
	Post,
	Request,
	Response,
	UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request as eRequest, Response as eResponse } from 'express';
import { LoggedCandidate, LoggedRecruiter } from '@/@shared/decorator';
import { Candidate } from '@/candidate/domain';
import { Recruiter } from '@/recruiter/domain';
import authConstants from './auth.constants';
import { AuthTokenGuard } from './usecase/authorization-strategy/token.guard';
import { LocalAuthGuard } from './usecase/do-login-strategy/local-auth.guard';
import { LoginInputDto, LoginOkDto } from './usecase/login/login.dto';
import { ManageSessionToken } from './usecase/manage-session-token/manage-session-token.usecase';
import {
	SessionOutputDto,
	CandidateSessionOutputDto,
	RecruiterSessionOutputDto,
} from './usecase/validate-session/validate-session.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly manageSessionToken: ManageSessionToken) {}

	@UseGuards(LocalAuthGuard)
	@Post('/login')
	@ApiBody({ type: LoginInputDto })
	async auth(@Request() request: eRequest, @Response() response: eResponse) {
		try {
			const user = request.user as LoginOkDto;

			const authToken = await this.manageSessionToken.newSessionToken(
				user,
			);

			const expiresAt = new Date();
			const currentMinute = expiresAt.getMinutes();
			const after = currentMinute + 2;
			expiresAt.setHours(
				after < currentMinute ? currentMinute + 1 : currentMinute,
			);
			expiresAt.setMinutes(after);

			response.cookie(authConstants.SESSION_COOKIE, authToken, {
				expires: expiresAt,
				httpOnly: true,
			});

			response.setHeader(authConstants.SESSION_COOKIE, authToken);

			return response.status(HttpStatus.CREATED).send();
		} catch (error) {
			return response
				.status(HttpStatus.UNAUTHORIZED)
				.json({ error: error.message });
		}
	}

	@UseGuards(AuthTokenGuard)
	@Get('/me')
	async whoAmI(
		@LoggedCandidate() meAsCandidate: Candidate,
		@LoggedRecruiter() meAsRecruiter: Recruiter,
	) {
		if (!meAsCandidate)
			return plainToClass(RecruiterSessionOutputDto, meAsRecruiter);

		if (!meAsRecruiter)
			return plainToClass(CandidateSessionOutputDto, meAsCandidate);

		return plainToClass(SessionOutputDto, {
			candidate: plainToClass(CandidateSessionOutputDto, meAsCandidate),
			recruiter: plainToClass(RecruiterSessionOutputDto, meAsCandidate),
		});
	}
}
