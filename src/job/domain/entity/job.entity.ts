import Entity from '@/@shared/entity/entity.abstract';
import { Event } from '../events/event';

export enum Status {
	'INSPECTION' = 'INSPECTION',
	'ACTIVATED' = 'ACTIVATED',
	'DEACTIVATED' = 'DEACTIVATED',
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
	createdAt?: Date;
	updatedAt?: Date;
	__v?: number;
};

export default class JobAd extends Entity {
	private _events: Event[];

	constructor(private _state: State = {} as any) {
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
			this._state.hideSalary ||
			isNaN(this._state.salary) ||
			!Number.isSafeInteger(this._state.salary) ||
			this._state.salary < 0
		)
			return 0;

		return this._state.salary;
	}

	get isSalaryHidden(): boolean {
		return this._state.hideSalary ?? false;
	}

	get description(): string {
		return this._state.description;
	}

	get status(): Status {
		return this._state.status ?? Status.DEACTIVATED;
	}

	get owner(): string {
		return this._state.owner;
	}

	get version(): number {
		return this._state.__v ?? 0;
	}

	public putEvents(...events: Event[]) {
		if (!this._events) this._events = [];

		this._events.push(...events);
		return this;
	}

	private updateState(data: Partial<JobAd>) {
		if (data.id) this._state.id = data.id;
		if (data.title) this._state.title = data.title;
		if (data.description) this._state.description = data.description;
		if (data.status) this._state.status = data.status;
		if (data.salary) this._state.salary = data.salary;
		this._state.hideSalary = data.isSalaryHidden ?? false;
		if (data.owner) this._state.owner = data.owner;
		if (data.createdAt) this._createdAt = data.createdAt;
		if (data.updatedAt) this._createdAt = data.updatedAt;
	}

	public compileEvents() {
		const createdAtOriginal = structuredClone(this._createdAt);

		for (const event of this._events) {
			// bypass past versions
			if (event.version() <= this._state.__v) continue;

			const updatedAt = structuredClone(event.data().createdAt);

			this.updateState(event.data());

			this._createdAt = createdAtOriginal;
			this._updatedAt = updatedAt;
			this._state.__v = event.version();
		}

		this._events = [];
		return this;
	}
}
