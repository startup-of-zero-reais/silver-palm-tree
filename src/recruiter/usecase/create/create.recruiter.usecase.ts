import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { CompanyFacade } from '@/company/facade/company.facade';
import CompanyFacadeInterface from '@/company/facade/company.facade.interface';
import {
  Recruiter,
  RecruiterRepositoryInterface,
  Status,
} from '@/recruiter/domain';
import RecruiterMongoRepository from '@/recruiter/infra/repository/mongo/recruiter.repository';
import { CreateInputDto } from './create.dto';

@Injectable()
export class CreateRecruiterUseCase implements UseCaseInterface {
  constructor(
    @Inject(RecruiterMongoRepository)
    private readonly recruiterRepository: RecruiterRepositoryInterface,

    @Inject(CompanyFacade)
    private readonly companyFacade: CompanyFacadeInterface,
  ) {}

  async execute(input: CreateInputDto): Promise<Recruiter> {
    const [recruiterAlreadyExists, _company] = await Promise.all([
      this.recruiterAlreadyExists(input.email),
      this.companyFacade.getByCNPJ(input.cnpj),
    ]);

    if (recruiterAlreadyExists) {
      throw new Error('Recruiter with this email already exists');
    }

    if (!_company) {
      throw new Error('Company not found');
    }

    const { name, email, image, password } = input;

    const recruiter = new Recruiter({
      name,
      email,
      image,
      password,
      status: Status.INSPECTION,
      company: {
        id: _company.id,
        cnpj: _company.cnpj,
      },
    });

    recruiter.encryptPassword();

    await this.recruiterRepository.create(recruiter);

    return recruiter;
  }

  async recruiterAlreadyExists(email: string): Promise<boolean> {
    const result = await this.recruiterRepository
      .findByEmail(email)
      .catch(() => undefined);

    return Boolean(result);
  }
}