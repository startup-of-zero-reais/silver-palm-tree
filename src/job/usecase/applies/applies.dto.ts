import {
	Exclude,
	Expose,
	plainToClass,
	Transform,
	TransformFnParams,
} from 'class-transformer';
import { ProfessionalExperience, Tech } from '@/candidate/domain';

export class AppliesInputDto {
	id: string;
	recruiterId: string;
}

@Exclude()
export class AppliesOutputDto {
	@Expose({ name: '_id' })
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

	@Expose()
	@Transform(applyHref)
	_links: any;
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

function applyHref({ obj }: TransformFnParams) {
	return {
		self: { href: `${process.env.BASE_URL}/candidates/${obj._id}` },
	};
}
