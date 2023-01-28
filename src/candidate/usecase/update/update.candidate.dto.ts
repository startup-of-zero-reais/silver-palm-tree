import { IsNotEmpty } from 'class-validator';
import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';

type Techs = {
  knowledge_level: KnowledgeLevel;
  tech: string;
};

export class UpdateCandidateInputDto {
  id: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  techs: Techs[];
}

export class UpdateCandidateOutputDto {
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
