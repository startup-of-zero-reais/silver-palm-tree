import {
	Exclude,
	Expose,
	Transform,
	TransformFnParams,
} from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';
import { ObjectTransformer } from '@/@shared/helpers';

export class SearchLocationInputDTO {
	@IsOptional()
	@IsString()
	@Length(7, 8)
	@Transform(decodeAndParse)
	zip: string;
}

function decodeAndParse({ value }: TransformFnParams) {
	const zip = decodeURIComponent(value);
	return zip.replace(/[^0-9]+/gm, '');
}

@Exclude()
export class SearchLocationOutputDTO {
	@Expose()
	@Transform(tranformFrom('cep'))
	zip: string;

	@Expose()
	@Transform(tranformFrom('uf'))
	uf: string;

	@Expose()
	@Transform(tranformFrom('localidade'))
	city: string;

	@Expose()
	@Transform(tranformFrom('bairro'))
	neighborhood: string;

	@Expose()
	@Transform(tranformFrom('logradouro'))
	street: string;
}

function tranformFrom(from: string) {
	return (params: TransformFnParams) => {
		return ObjectTransformer.transform(params.obj)
			.property(from as any)
			.to(params.key as any)
			.transformed()[params.key];
	};
}
