enum KnowledgeLevel { 
    BEGINNER,
    INTERMEDIATE,
    ADVANCED,
}

type Props = {
    knowledge_level: KnowledgeLevel;
    tech: string;
} 

export default class Techs  {
     
    private _knowledge_level: KnowledgeLevel;
    private _tech: string;

    constructor(props: Props) {
        this._knowledge_level = props.knowledge_level;
        this._tech = props.tech;
    } 
}