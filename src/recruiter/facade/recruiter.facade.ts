import { Injectable } from '@nestjs/common';
import { Recruiter } from '../domain';
import RecruiterFacadeInterface from './recruiter.facade.interface';

@Injectable()
export class RecruiterFacade implements RecruiterFacadeInterface {
  async getByID(id: string): Promise<Recruiter> {
    throw new Error('Method not implemented.');
  }

  async getByEmail(email: string): Promise<Recruiter> {
    throw new Error('Method not implemented.');
  }
}
