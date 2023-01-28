import UseCaseInterface from 'src/@shared/usecase/use-case.interface';
import CandidateFacadeInterface, {
  CandidateFacadeOutputDto,
} from './candidate.facade.interface';

export default class CandidateFacade implements CandidateFacadeInterface {
  constructor(private readonly _findByEmail: UseCaseInterface) {}

  async getByEmail(email: string): Promise<CandidateFacadeOutputDto> {
    return this._findByEmail.execute({ email });
  }
}
