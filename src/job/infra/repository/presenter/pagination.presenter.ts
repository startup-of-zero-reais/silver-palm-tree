import { PaginationInterface } from '@/@shared/repository/pagination-interface';

export default class PaginationPresenter<T> implements PaginationInterface<T> {
	constructor(
		private readonly _items: T[],
		private readonly _total: number,
		private readonly _pageSize = 30,
		private readonly _page = 1,
	) {}

	items(): T[] {
		return this._items || [];
	}

	total(): number {
		return this._total || 0;
	}

	lastPage(): number {
		return Math.ceil(this.total() / this._pageSize) || 0;
	}

	firstPage(): number {
		return 1;
	}

	currentPage(): number {
		return Math.ceil(this._page - 1 / this._pageSize) + 1;
	}

	perPage(): number {
		return this._pageSize;
	}
}
