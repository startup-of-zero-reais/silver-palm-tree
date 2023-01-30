import PaginationPresenter from './pagination.presenter';

describe('', () => {
	it('should pagination presenter on items', () => {
		const items = ['any_item1', 'any_item2', 'any_item3'];
		const paginationPresenter = new PaginationPresenter(items, 2, 1, 3);

		expect(paginationPresenter.total()).toBe(items.length);
		expect(paginationPresenter.currentPage()).toBe(1);
		expect(paginationPresenter.firstPage()).toBe(1);
		expect(paginationPresenter.lastPage()).toBe(2);
	});
});
