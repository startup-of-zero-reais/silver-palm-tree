import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { ProfessionalExperience, Tech } from '@/candidate/domain';

export class FindByIdsInputDto {
	@IsArray()
	@IsString({ each: true })
	ids: string[];
}

@Exclude()
export class FindByIdsOutputDto {
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
	techs: Tech[];

	@Expose()
	@Transform(({ value }) =>
		plainToClass(ProfessionalExperienceOutputDto, value),
	)
	professionalExperiences: ProfessionalExperience[];

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
export class ProfessionalExperienceOutputDto {
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
