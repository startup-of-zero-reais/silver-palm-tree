import Entity from '@/@shared/entity/entity.abstract';
import JobAd from '../entity/job.entity';

export class Event extends Entity {
	constructor(
		private readonly _action: string,
		private readonly _data: Partial<JobAd>,
		private readonly _version: number = 0,
	) {
		super(_data.id);
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
}
