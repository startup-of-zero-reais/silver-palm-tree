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
import { Request as eRequest, Response as eResponse } from 'express';
import authConstants from './auth.constants';
import { AuthTokenGuard } from './usecase/authorization-strategy/token.guard';
import { LocalAuthGuard } from './usecase/do-login-strategy/local-auth.guard';
import { LoginInputDto } from './usecase/login/login.dto';
import { ManageSessionToken } from './usecase/manage-session-token/manage-session-token.usecase';

@Controller('auth')
export class AuthController {
  constructor(private readonly manageSessionToken: ManageSessionToken) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: LoginInputDto })
  async auth(@Request() request: eRequest, @Response() response: eResponse) {
    try {
      const user = request.user;

      const authToken = await this.manageSessionToken.newSessionToken(user);

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
  async whoAmI(@Request() request: eRequest) {
    console.log(request.user);
    return request.user;
  }
}
