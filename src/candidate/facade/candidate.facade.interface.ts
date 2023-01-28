import { FindOutputDto } from '../usecase/find/find.dto';

export type CandidateFacadeOutputDto = FindOutputDto & { password: string };

export default interface CandidateFacadeInterface {
  getByEmail(email: string): Promise<CandidateFacadeOutputDto>;
}
