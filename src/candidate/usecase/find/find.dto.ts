import { IsNotEmpty } from 'class-validator';
import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';

export class FindInputDto {
  @IsNotEmpty()
  id: string;
}

export class FindOutputDto {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public image: string,
    public phone: string,
    public techs: Techs[],
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}

type Techs = {
  knowledge_level: KnowledgeLevel;
  tech: string;
};
