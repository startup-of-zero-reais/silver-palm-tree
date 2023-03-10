import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import Company from '@/company/domain/entity/company.entity';
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
			this.companyFacade.getByCNPJ(input.company.cnpj),
		]);

		let company: Company = _company;

		if (recruiterAlreadyExists) {
			throw new HttpErrorException(
				'Recruiter with this email already exists',
				409,
			);
		}

		if (company && (input.company.description || input.company.logo))
			throw new HttpErrorException(
				'Forbidden resource',
				HttpStatus.FORBIDDEN,
			);

		let isNewCompany = false;
		if (!_company && input.company.description && input.company.logo) {
			isNewCompany = true;

			company = new Company({
				cnpj: input.company.cnpj,
				description: input.company.description,
				logo: input.company.logo,
			});
		}

		if (!company) {
			throw new HttpErrorException('Company not found', 404);
		}

		const { name, email, image, password } = input;

		const recruiter = new Recruiter({
			name,
			email,
			image,
			password,
			status: Status.INSPECTION,
			company: {
				id: company.id,
				cnpj: company.cnpj,
				isAdmin: isNewCompany,
			},
		});

		recruiter.encryptPassword();

		if (isNewCompany) {
			company.setAdminID(recruiter.id);
			await this.companyFacade.create(company);
		}

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
