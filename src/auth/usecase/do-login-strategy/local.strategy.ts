import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '@/auth/usecase/login/login.usecase';
import Candidate from '@/candidate/domain/entity/candidate.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<Candidate | any> {
    const user = await this.loginUseCase.execute({
      email: username,
      password,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
