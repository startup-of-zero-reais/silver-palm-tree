import {
	Exclude,
	Expose,
	Transform,
	TransformFnParams,
	Type,
} from 'class-transformer';

type Href = Record<string, { href: string }>;

@Exclude()
export class NamedItem {
	@Expose()
	name: string;

	@Expose()
	@Transform(applyHref)
	_links: Href;
}

@Exclude()
export class Techs extends NamedItem {}

@Exclude()
export class Contracts extends NamedItem {}

@Exclude()
export class Availability extends NamedItem {}

@Exclude()
export class Embedded {
	@Expose()
	@Type(() => Techs)
	techs: Techs[];

	@Expose()
	@Type(() => Contracts)
	contracts: Contracts[];

	@Expose()
	@Type(() => Availability)
	availability: Availability[];
}

@Exclude()
export class ListFiltersOutputDTO {
	@Expose()
	@Type(() => Embedded)
	_embedded: Embedded;
}

function applyHref({ obj }: TransformFnParams) {
	const key = obj.constructor.name.toLowerCase();
	const p = new URLSearchParams({ [key]: obj.name });
	return { jobs: { href: `${process.env.BASE_URL}/jobs?${p}` } };
}
