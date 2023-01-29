import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Candidate } from '@/candidate/domain';

@Injectable()
export class ManageSessionToken {
  constructor(private config: ConfigService, private jwtService: JwtService) {}

  public async newSessionToken(user: Candidate | any): Promise<string> {
    const type = getTypeFrom(user);

    if (type === 'unknown') {
      throw new Error('can not identify user type');
    }

    return this.jwtService.sign(
      {
        type,
      },
      {
        issuer: this.config.get('ISSUER'),
        secret: this.config.get('SECRET'),
        expiresIn: this.config.get('SESSION_TIME'),
        subject: user.id,
      },
    );
  }
}

class TempRecruiter {}

function getTypeFrom(user: Candidate | any) {
  if (user instanceof Candidate) {
    return 'candidate' as const;
  }

  if (user instanceof TempRecruiter) {
    return 'recruiter' as const;
  }

  return 'unknown' as const;
}
