import { IsNotEmpty } from 'class-validator';
import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';

export class FindInputDto {
  @IsNotEmpty()
  id: string;
}

export class FindOutputDto {
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

type ProfessionalExperience = {
  company: string;
  role: string;
  acting_time: string;
  description: string;
  qualification: string;
};

type Techs = {
  knowledge_level: KnowledgeLevel;
  tech: string;
};
