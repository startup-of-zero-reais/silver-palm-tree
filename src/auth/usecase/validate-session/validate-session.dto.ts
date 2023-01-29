export class PayloadDto {
  type: 'candidate' | 'recruiter' | 'unknown';
  iat: number;
  exp: number;
  iss: string;
  /** @property sub - is the subject of the payload. Matches with ID */
  sub: string;
}

export class SessionOutputDto {}
