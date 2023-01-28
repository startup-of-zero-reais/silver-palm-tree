import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { KnowledgeLevel } from '../../../candidate/domain/value-object/techs-value-object';

class Techs {
  knowledge_level: KnowledgeLevel;
  tech: string;
}

type ProfessionalExperience = {
  company: string;
  role: string;
  acting_time: string;
  description: string;
  qualification: string;
};

export class UpdateCandidateInputDto {
  @IsNotEmpty()
  @IsOptional()
  id: string;
  @IsNotEmpty()
  @IsOptional()
  name: string;
  @IsNotEmpty()
  @IsOptional()
  image: string;
  @IsNotEmpty()
  @IsOptional()
  phone: string;
  @IsNotEmpty()
  @IsOptional()
  techs: Techs[];
  @IsNotEmpty()
  @IsOptional()
  professionalExperiences: ProfessionalExperience[];
}

export class UpdateCandidateOutputDto {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;

  @Transform((param) => {
    console.log(param);
    return [];
  })
  techs: Techs[];

  // @Expose()
  // @Transform((param) => JSON.stringify(param.value))
  // professionalExperiences: ProfessionalExperience[];
  createdAt: Date;
  updatedAt: Date;
}
