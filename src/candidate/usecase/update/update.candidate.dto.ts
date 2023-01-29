import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Tech, ProfessionalExperience } from '@/candidate/domain';

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
  techs: Tech[];

  @IsNotEmpty()
  @IsOptional()
  professionalExperiences: ProfessionalExperience[];
}

@Exclude()
export class UpdateCandidateOutputDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  image: string;

  @Expose()
  phone: string;

  @Expose()
  @Transform(({ value }) => plainToClass(TechOutputDto, value))
  techs: TechOutputDto[];

  @Expose()
  @Transform(({ value }) =>
    plainToClass(ProfessionalExperienceOutputDto, value),
  )
  professionalExperiences: ProfessionalExperienceOutputDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

@Exclude()
class TechOutputDto {
  @Expose()
  knowledge_level: string;
  @Expose()
  tech: string;
}

@Exclude()
class ProfessionalExperienceOutputDto {
  @Expose()
  company: string;
  @Expose()
  role: string;
  @Expose()
  acting_time: string;
  @Expose()
  description: string;
  @Expose()
  qualification: string;
}
