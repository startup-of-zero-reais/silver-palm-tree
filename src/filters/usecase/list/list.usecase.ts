import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { FiltersMongoRepository } from '@/filters/infra/repository/mongo/filters.repository';

@Injectable()
export class ListFiltersUseCase implements UseCaseInterface {
	constructor(
		@Inject(FiltersMongoRepository)
		private readonly repository: FiltersMongoRepository,
	) {}

	async execute() {
		const [contracts, techs, availability] = await Promise.all([
			this.repository.loadContracts(),
			this.repository.loadTechs(),
			this.repository.loadAvailability(),
		]);

		return { contracts, techs, availability };
	}
}
