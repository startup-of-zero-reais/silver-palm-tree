import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';

type Techs = {
  knowledge_level: KnowledgeLevel;
  tech: string;
};

type ProfessionalExperience = {
  company: string;
  role: string;
  acting_time: string;
  description: string;
  qualification: string;
};

@Expose()
export class CreateCandidateOutputDto {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  techs: Techs[];
  professionalExperiences: ProfessionalExperience[];
  createdAt: Date;
  updatedAt: Date;
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
  password: string;

  @IsNotEmpty()
  techs: Techs[];

  @IsNotEmpty()
  @IsOptional()
  professionalExperiences: ProfessionalExperience[];
}
