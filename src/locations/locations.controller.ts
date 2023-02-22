import { Controller, Get, Query } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EmbeddedLocationsOutputDTO } from './usecase/list/list.dto';
import { ListUseCase } from './usecase/list/list.usecase';
import {
	SearchLocationInputDTO,
	SearchLocationOutputDTO,
} from './usecase/search/search.dto';
import { SearchUseCase } from './usecase/search/search.usecase';

@Controller('locations')
export class LocationsController {
	constructor(
		private readonly searchUseCase: SearchUseCase,
		private readonly listUseCase: ListUseCase,
	) {}

	@Get()
	async find(@Query() search: SearchLocationInputDTO) {
		if (search.zip) {
			return plainToClass(
				SearchLocationOutputDTO,
				(await this.searchUseCase.execute(search)).data,
			);
		}

		return plainToClass(EmbeddedLocationsOutputDTO, {
			_embedded: await this.listUseCase.execute(),
		});
	}
}
