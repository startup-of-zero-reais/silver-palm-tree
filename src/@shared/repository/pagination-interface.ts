export interface PaginationInterface<T> {
	items(): T[];
	total(): number;
	lastPage(): number;
	firstPage(): number;
	currentPage(): number;
	perPage(): number;
}
