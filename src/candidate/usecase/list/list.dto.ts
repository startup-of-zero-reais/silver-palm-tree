import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';

export namespace List {
  export type Input = {
    page_size: number;
    page: number;
  };
  export type Output = {
    data: {
      id: string;
      name: string;
      email: string;
      image: string;
      phone: string;
      techs?: {
        knowledge_level: KnowledgeLevel;
        tech: string;
      }[];
      createdAt: Date;
      updatedAt: Date;
    }[];
    meta: {
      total: number;
      lastPage: number;
      firstPage: number;
      currentPage: number;
      perPage: number;
    };
  };
}
