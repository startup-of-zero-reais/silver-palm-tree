import {
	Exclude,
	Expose,
	plainToClass,
	Transform,
	TransformFnParams,
} from 'class-transformer';

@Exclude()
export class EmbeddedLocationsOutputDTO {
	@Expose()
	@Transform(({ value }) =>
		value.map((location) => plainToClass(ListLocationOutputDTO, location)),
	)
	_embedded: ListLocationOutputDTO[];
}

@Exclude()
export class ListLocationOutputDTO {
	@Expose()
	name: string;

	@Expose()
	@Transform(applyHref)
	_links: any;
}

function applyHref(params: TransformFnParams) {
	const searchParam = new URLSearchParams();
	searchParam.set('location', params.obj.name);
	return { jobs: `${process.env.BASE_URL}/jobs?${searchParam.toString()}` };
}
