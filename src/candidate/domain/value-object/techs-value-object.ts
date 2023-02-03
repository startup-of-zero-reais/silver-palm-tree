export enum KnowledgeLevel {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
}

type Props = {
	knowledge_level: KnowledgeLevel;
	tech: string;
};

export default class Techs {
	private _knowledge_level: KnowledgeLevel;
	private _tech: string;

	constructor(props: Props) {
		if (!props) return;
		this._knowledge_level = props.knowledge_level;
		this._tech = props.tech;
	}

	get knowledge_level(): KnowledgeLevel {
		return this._knowledge_level;
	}

	get tech(): string {
		return this._tech;
	}
}
