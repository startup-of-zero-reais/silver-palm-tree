import { Tech, KnowledgeLevel } from '@/candidate/domain';

type TechObj = {
	knowledge_level: KnowledgeLevel;
	tech: string;
};

export class TechsMapper {
	static ToDomain(techsArray: any): Tech[] {
		if (!techsArray) return [];

		return techsArray.map(
			(tech: TechObj) =>
				new Tech({
					knowledge_level: tech.knowledge_level,
					tech: tech.tech,
				}),
		);
	}

	static ToObject(techsArray: Tech[]): TechObj[] {
		if (!techsArray) return [];

		return techsArray.map((tech) => ({
			knowledge_level: tech.knowledge_level,
			tech: tech.tech,
		}));
	}
}
