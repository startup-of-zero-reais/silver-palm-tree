import { Controller, Get } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ListFiltersOutputDTO } from './usecase/list/list.dto';
import { ListFiltersUseCase } from './usecase/list/list.usecase';

@Controller('filters')
export class FiltersController {
	constructor(private readonly listFilters: ListFiltersUseCase) {}

	@Get()
	async get() {
		const filters = await this.listFilters.execute();
		return plainToClass(ListFiltersOutputDTO, { _embedded: filters });
	}
}
