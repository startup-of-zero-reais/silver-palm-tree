import { PaginationInterface } from 'src/@shared/repository/pagination-interface';

export default class PaginationPresenter<T> implements PaginationInterface<T> {
	constructor(
		private readonly _items: T[],
		private readonly _pageSize: number,
		private readonly _page: number,
		private readonly _total: number,
	) {
		this._pageSize = this._pageSize || 4;
		this._page = this._page || 1;
	}

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
		return Math.floor(this._page - 1 / this._pageSize) + 1;
	}
	perPage(): number {
		return this._pageSize || 0;
	}
}
