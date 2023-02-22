import Entity from '@/@shared/entity/entity.abstract';

type Props = {
	id?: string;
	name: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export class Location extends Entity {
	constructor(private _state: Props) {
		super(_state.id, _state.createdAt, _state.updatedAt);
	}

	get name(): string {
		return this._state.name;
	}
}
