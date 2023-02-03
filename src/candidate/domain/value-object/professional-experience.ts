type Props = {
	company: string;
	role: string;
	acting_time: string;
	description: string;
	qualification: string;
};

export class ProfessionalExperience {
	constructor(private readonly props: Props) {}

	get company(): string {
		return this.props.company;
	}

	get role(): string {
		return this.props.role;
	}

	get acting_time(): string {
		return this.props.acting_time;
	}

	get description(): string {
		return this.props.description;
	}

	get qualification(): string {
		return this.props.qualification;
	}
}
