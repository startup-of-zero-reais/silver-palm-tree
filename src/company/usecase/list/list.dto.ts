export class ListCompaniesInputDto {
	page = 1;
	page_size: 10;
}

export class ListCompaniesOutputDto {
	data = [];
	meta: Meta;
}

type Meta = {
	total: number;
	currentPage: number;
	firstPage: number;
	lastPage: number;
	perPage: number;
};
