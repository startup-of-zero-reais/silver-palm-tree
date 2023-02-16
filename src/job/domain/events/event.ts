import Entity from '@/@shared/entity/entity.abstract';
import JobAd from '../entity/job.entity';

export class Event extends Entity {
	constructor(
		private readonly _action: string,
		private readonly _data: Partial<JobAd>,
		readonly _createdAt: Date = new Date(),
		private _version: number = 0,
	) {
		super(_data.id, _createdAt, _data.createdAt);
	}

	public action(): string {
		return this._action;
	}

	public data() {
		return this._data;
	}

	public version(): number {
		return this._version;
	}

	set __v(__v: number) {
		this._version = __v;
	}
}
