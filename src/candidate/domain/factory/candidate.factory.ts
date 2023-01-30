import Candidate from '../entity/candidate.entity';
import { ProfessionalExperience } from '../value-object/professional-experience';
import Techs, { KnowledgeLevel } from '../value-object/techs-value-object';

type Props = {
	email: string;
	image: string;
	password: string;
	phone: string;
	name: string;
};

type ProfessionalExperienceProps = {
	company: string;
	role: string;
	acting_time: string;
	description: string;
	qualification: string;
};

type TechsProps = {
	knowledge_level: KnowledgeLevel;
	tech: string;
};

export default class CandidateFactory {
	static mapToProfessionalExperience(
		professionalExperience: ProfessionalExperienceProps[],
	): ProfessionalExperience[] {
		if (!professionalExperience) return [];

		return professionalExperience.map(
			(experience) =>
				new ProfessionalExperience({
					acting_time: experience.acting_time,
					description: experience.description,
					company: experience.company,
					role: experience.role,
					qualification: experience.qualification,
				}),
		);
	}

	static mapToTechs(techs: TechsProps[]): Techs[] {
		if (!techs) return [];

		return techs.map(
			(tech) =>
				new Techs({
					knowledge_level: tech.knowledge_level,
					tech: tech.tech,
				}),
		);
	}

	public static create(
		props: Props,
		techs: TechsProps[],
		professionalExperiences: ProfessionalExperienceProps[],
	) {
		const { email, image, password, name, phone } = props;

		return new Candidate({
			email,
			image,
			password,
			name,
			phone,
			techs: CandidateFactory.mapToTechs(techs),
			professionalExperiences:
				CandidateFactory.mapToProfessionalExperience(
					professionalExperiences,
				),
		});
	}
}
