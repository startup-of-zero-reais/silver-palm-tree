import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { ViaCepRepository } from '@/locations/infra/repository/viacep/viacep.repository';
import { SearchLocationInputDTO } from './search.dto';

@Injectable()
export class SearchUseCase implements UseCaseInterface {
	constructor(
		@Inject(ViaCepRepository)
		private readonly repository: ViaCepRepository,
	) {}

	async execute(input: SearchLocationInputDTO): Promise<any> {
		return this.repository.findByZip(input.zip);
	}
}
