import { PaginationInterface } from './pagination-interface';

export default interface Repository<T> {
  create(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  find(id: string): Promise<T>;
  paginate(per_page: number, page: number): Promise<PaginationInterface<T>>;
}
