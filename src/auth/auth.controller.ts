import {
	Controller,
	ForbiddenException,
	Get,
	Headers,
	HttpStatus,
	Post,
	Request,
	Response,
	UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request as eRequest, Response as eResponse } from 'express';
import {
	LoggedCandidate,
	LoggedRecruiter,
	MustBeAuth,
} from '@/@shared/decorator';
import { AuthToken } from '@/@shared/decorator/token.decorator';
import { Candidate } from '@/candidate/domain';
import { Recruiter } from '@/recruiter/domain';
import authConstants from './auth.constants';
import { LocalAuthGuard } from './usecase/do-login-strategy/local-auth.guard';
import { LoginInputDto, LoginOkDto } from './usecase/login/login.dto';
import { LogoutUseCase } from './usecase/logout/logout.usecase';
import { ManageSessionToken } from './usecase/manage-session-token/manage-session-token.usecase';
import {
	SessionOutputDto,
	CandidateSessionOutputDto,
	RecruiterSessionOutputDto,
} from './usecase/validate-session/validate-session.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly manageSessionToken: ManageSessionToken,
		private readonly logoutUseCase: LogoutUseCase,
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('/login')
	@ApiBody({ type: LoginInputDto })
	async auth(@Request() request: eRequest, @Response() response: eResponse) {
		try {
			const user = request.user as LoginOkDto;

			const authToken = await this.manageSessionToken.newSessionToken(
				user,
			);

			const expiresIn = 60;
			const expiresAt = new Date();
			const currentMinute = expiresAt.getMinutes();
			const after = currentMinute + expiresIn;

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

	@MustBeAuth()
	@Get('/me')
	async whoAmI(
		@Headers('x-audience') aud: 'recruiter' | 'candidate' | 'both' = 'both',
		@LoggedCandidate() meAsCandidate: Candidate,
		@LoggedRecruiter() meAsRecruiter: Recruiter,
	) {
		let candidate: CandidateSessionOutputDto,
			recruiter: RecruiterSessionOutputDto;

		if (meAsCandidate && ['both', 'candidate'].includes(aud))
			candidate = plainToClass(CandidateSessionOutputDto, meAsCandidate);

		if (meAsRecruiter && ['both', 'recruiter'].includes(aud))
			recruiter = plainToClass(RecruiterSessionOutputDto, meAsRecruiter);

		// if has no one of candidate or recruiter throws a
		// forbidden exception who says
		// You can not consume this service
		if (!recruiter && !candidate)
			throw new ForbiddenException('You can not consume this service');

		return plainToClass(SessionOutputDto, {
			candidate: plainToClass(CandidateSessionOutputDto, candidate),
			recruiter: plainToClass(RecruiterSessionOutputDto, recruiter),
		});
	}

	@MustBeAuth()
	@Post('logout')
	async logout(@AuthToken() token: string) {
		return this.logoutUseCase.execute({ token });
	}
}
