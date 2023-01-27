import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';

export namespace Create {
  export type Input = {
    name: string;
    email: string;
    image: string;
    phone: string;
    techs?: {
      knowledge_level: KnowledgeLevel;
      tech: string;
    }[];
  };
  export type Output = {
    id: string;
    name: string;
    email: string;
    image: string;
    phone: string;
    techs?: {
      knowledge_level: KnowledgeLevel;
      tech: string;
    }[];
  };
}
