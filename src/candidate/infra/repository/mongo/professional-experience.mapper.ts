import { ProfessionalExperience } from '@/candidate/domain';

type ExperienceObj = {
	acting_time: string;
	company: string;
	description: string;
	qualification: string;
	role: string;
};

export class ProfessionalExperienceMapper {
	static ToDomain(experiences: any): ProfessionalExperience[] {
		if (!experiences) return [];

		return experiences.map(
			(experience: ExperienceObj) =>
				new ProfessionalExperience({
					acting_time: experience.acting_time,
					company: experience.company,
					description: experience.description,
					qualification: experience.qualification,
					role: experience.role,
				}),
		);
	}

	static ToObject(experiences: ProfessionalExperience[]): ExperienceObj[] {
		if (!experiences) return [];

		return experiences.map((experience: ProfessionalExperience) => ({
			acting_time: experience.acting_time,
			company: experience.company,
			description: experience.description,
			qualification: experience.qualification,
			role: experience.role,
		}));
	}
}
