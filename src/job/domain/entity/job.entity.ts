import Entity from '@/@shared/entity/entity.abstract';
import Company from '@/company/domain/entity/company.entity';
import { Event } from '../events/event';

export enum Status {
	/** `INSPECTION` means the job is recently added. It needs a inspection */
	'INSPECTION' = 'INSPECTION',
	/** `RE_INSPECTION` means the job was `ACTIVATED` but was updated and needs a new inspection */
	'RE_INSPECTION' = 'RE_INSPECTION',
	/** `ACTIVATED` means the job was inspectioned and activated */
	'ACTIVATED' = 'ACTIVATED',
	/** `DEACTIVATED` means the job was deactivated manually by the owner or editors */
	'DEACTIVATED' = 'DEACTIVATED',
	/** `EXPIRED` means the job was pass the lifecicle */
	'EXPIRED' = 'EXPIRED',
	/** `BLOCKED` means the job not follows the quality gate from the platform */
	'BLOCKED' = 'BLOCKED',
}

export type PartialState = Partial<State>;

export type State = {
	id?: string;
	title: string;
	salary: number;
	hideSalary?: boolean;
	description: string;
	status: Status;
	owner: string;
	editors?: string[];
	companyID: string;
	company?: Company;
	contracts?: string[];
	techs?: string[];
	availability: string;
	createdAt?: Date;
	updatedAt?: Date;
	__v?: number;
};

export default class JobAd extends Entity {
	private _events: Event[];

	constructor(private _state: Partial<State> = {} as any) {
		super(_state?.id, _state?.createdAt, _state?.updatedAt);
	}

	get title(): string {
		return this._state.title;
	}

	get salaryStr(): string {
		if (
			this._state.hideSalary ||
			isNaN(this._state.salary) ||
			!Number.isSafeInteger(this._state.salary) ||
			this._state.salary <= 0
		)
			return 'A combinar';

		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
			compactDisplay: 'short',
		}).format(this._state.salary / 100);
	}

	get salary(): number {
		if (
			isNaN(this._state.salary) ||
			!Number.isSafeInteger(this._state.salary) ||
			this._state.salary < 0
		)
			return 0;

		return this._state.salary;
	}

	get isSalaryHidden(): boolean {
		return this._state.hideSalary;
	}

	get description(): string {
		return this._state.description;
	}

	get status(): Status {
		return this._state.status;
	}

	get owner(): string {
		return this._state.owner;
	}

	get editors(): string[] {
		return this._state.editors ?? [];
	}

	get companyID(): string {
		return this._state.companyID;
	}

	get company(): Company {
		return this._state.company;
	}

	get contracts(): string[] {
		return this._state.contracts;
	}

	get techs(): string[] {
		return this._state.techs;
	}

	get availability(): string {
		return this._state.availability;
	}

	get lastEditor(): string {
		return this._state.editors.at(-1);
	}

	get version(): number {
		return this._state.__v ?? 0;
	}

	public attachCompany(company: Company): JobAd {
		this._state.company = company;
		return this;
	}

	public putEvents(...events: Event[]) {
		if (!this._events) this._events = [];

		this._events.push(...events);
		return this;
	}

	public addEditors(...editors: string[]) {
		if (!this._state.editors) this._state.editors = [];

		const uniqEditors = new Set([...this._state.editors, ...editors]);
		this._state.editors = [...uniqEditors];
	}

	private updateState(data: Partial<Omit<JobAd, 'createdAt' | 'updatedAt'>>) {
		if (data.id) this._state.id = data.id;
		if (data.title) this._state.title = data.title;
		if (data.description) this._state.description = data.description;
		if (data.status) this._state.status = data.status;
		if (data.salary) this._state.salary = data.salary;
		if (typeof data.isSalaryHidden === 'boolean')
			this._state.hideSalary = data.isSalaryHidden ?? false;
		if (data.owner) this._state.owner = data.owner;
		if (data.editors) this.addEditors(...data.editors);
		if (data.companyID) this._state.companyID = data.companyID;
		if (data.contracts) this._state.contracts = data.contracts;
		if (data.availability) this._state.availability = data.availability;
		if (data.techs) this._state.techs = data.techs;
	}

	public compileEvents() {
		let createdAtOriginal = structuredClone(this._createdAt);

		for (const event of this._events) {
			// to first event we set up createdAt date
			if (event.version() == 0)
				createdAtOriginal = structuredClone(event.createdAt);

			// bypass past versions
			if (event.version() <= this._state.__v && event.version() > 0)
				continue;

			const updatedAt = structuredClone(event.createdAt);

			this.updateState(event.data());

			this._createdAt = createdAtOriginal;
			this._updatedAt = updatedAt;
			this._state.__v = event.version();
		}

		this._events = [];
		return this;
	}
}
