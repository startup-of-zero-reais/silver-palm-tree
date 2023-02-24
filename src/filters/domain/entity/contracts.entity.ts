import Entity from '@/@shared/entity/entity.abstract';

type State = { id?: string; name: string };

export class Contracts extends Entity {
	constructor(private readonly _state: State) {
		super(_state.id);
	}

	get name(): string {
		return this._state.name;
	}
}
