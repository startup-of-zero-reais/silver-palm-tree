import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';
import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';

type Techs = {
  knowledge_level: KnowledgeLevel;
  tech: string;
};

export class CreateCandidateOutputDto {
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

export class CreateCandidateInputDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsUrl()
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  techs: Techs[];
}
