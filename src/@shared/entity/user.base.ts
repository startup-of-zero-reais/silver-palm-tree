import { compareSync, hashSync } from 'bcryptjs';
import Entity from './entity.abstract';

export type BaseUserProps = {
	id?: string;
	name: string;
	email: string;
	image: string;
	password: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export type NotUpdableProps = 'id' | 'email' | 'createdAt' | 'updatedAt';

export default abstract class BaseUser extends Entity {
	protected _name: string;
	protected _email: string;
	protected _image: string;
	protected _password: string;

	constructor(props: BaseUserProps) {
		super(props.id, props.createdAt, props.updatedAt);

		this._name = props.name;
		this._email = props.email;
		this._image = props.image;
		this._password = props.password;
	}

	abstract validate(): void;
	abstract update<U = any>(props: Omit<U, NotUpdableProps>): void;

	public encryptPassword() {
		this._password = hashSync(this._password);
	}

	public isValidPassword(password: string): boolean {
		return compareSync(password, this._password);
	}

	get name(): string {
		return this._name;
	}

	get email(): string {
		return this._email;
	}

	get image(): string {
		return this._image;
	}

	get password(): string {
		return this._password;
	}
}
