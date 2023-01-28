export class ListCandidateInputDto {
  page = 1;
  page_size: 10;
}

export class ListCandidateOutputDto {
  constructor(public data = [], public meta: Meta) {}
}

type Meta = {
  total: number;
  currentPage: number;
  firstPage: number;
  lastPage: number;
  perPage: number;
};
