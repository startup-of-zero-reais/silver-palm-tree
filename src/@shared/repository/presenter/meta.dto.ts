import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { PaginationInterface } from '../pagination-interface';

@Exclude()
export class Meta {
	@Expose() total: number;
	@Expose() current_page: number;
	@Expose() first_page: number;
	@Expose() last_page: number;
	@Expose() per_page: number;
}

export function ToMeta() {
	return Transform(({ obj }) => parseObjToMeta(obj));
}

export function parseObjToMeta(pagination: PaginationInterface<any>) {
	return plainToClass(Meta, {
		total: pagination.total(),
		current_page: pagination.currentPage(),
		first_page: pagination.firstPage(),
		last_page: pagination.lastPage(),
		per_page: pagination.perPage(),
	});
}
