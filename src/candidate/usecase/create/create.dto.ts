import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { Tech, ProfessionalExperience } from '@/candidate/domain';

@Exclude()
export class CreateCandidateOutputDto {
	@Expose() id: string;
	@Expose() name: string;
	@Expose() email: string;
	@Expose() image: string;
	@Expose() phone: string;

	@Expose()
	@Type(() => TechOutputDto)
	techs: TechOutputDto[];

	@Expose()
	@Type(() => ProfessionalExperienceOutputDto)
	professionalExperiences: ProfessionalExperience[];

	@Expose() createdAt: Date;
	@Expose() updatedAt: Date;
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
	@IsOptional()
	techs: Tech[];

	@IsNotEmpty()
	@IsOptional()
	professionalExperiences: ProfessionalExperience[];
}

@Exclude()
class TechOutputDto {
	@Expose() knowledge_level: string;
	@Expose() tech: string;
}

@Exclude()
class ProfessionalExperienceOutputDto {
	@Expose() company: string;
	@Expose() role: string;
	@Expose() acting_time: string;
	@Expose() description: string;
	@Expose() qualification: string;
}
