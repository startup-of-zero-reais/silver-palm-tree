import { Availability } from '@/filters/domain/entity/availability.entity';
import { Contracts } from '@/filters/domain/entity/contracts.entity';
import { Techs } from '@/filters/domain/entity/techs.entity';

type NamedItem = { name: string };

export class FiltersMapper {
	static toTech({ name }: NamedItem): Techs {
		return new Techs({ name });
	}

	static toTechs(techs: NamedItem[] = []): Techs[] {
		return techs.map(FiltersMapper.toTech);
	}

	static toContract({ name }: NamedItem): Contracts {
		return new Contracts({ name });
	}

	static toContracts(contracts: NamedItem[] = []): Contracts[] {
		return contracts.map(FiltersMapper.toContract);
	}

	static toAvailability({ name }: NamedItem): Availability {
		return new Availability({ name });
	}

	static toAvailabilities(availabilities: NamedItem[] = []): Availability[] {
		return availabilities.map(FiltersMapper.toAvailability);
	}
}
