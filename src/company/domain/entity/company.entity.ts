import Entity from '@/@shared/entity/entity.abstract';
import { NotUpdableProps } from '@/@shared/entity/user.base';
import NotificationError from '@/@shared/notification/notification.error';
import CompanyValidatorFactory from '../factory/company.validator.factory';

export type Props = {
	id?: string;
	logo: string;
	cnpj: string;
	description: string;
	createdAt?: Date;
	updatedAt?: Date;
};

export default class Company extends Entity {
	private _logo: string;
	private _cnpj: string;
	private _description: string;

	constructor(props: Props) {
		super(props.id, props.createdAt, props.updatedAt);
		this._id = props.id;
		this._logo = props.logo;
		this._cnpj = props.cnpj;
		this._description = props.description;
		this.validate();
	}

	get id(): string {
		return this._id;
	}

	get logo(): string {
		return this._logo;
	}

	get cnpj(): string {
		return this._cnpj;
	}

	get description(): string {
		return this._description;
	}

	update(props: Omit<Props, 'id' | 'createdAt' | 'updatedAt'>) {
		const { cnpj, description, logo } = props;
		if (cnpj) this._cnpj = cnpj;
		if (description) this._description = description;
		if (logo) this._logo = logo;

		this.validate();
		this._updatedAt = new Date();
	}

	validate() {
		CompanyValidatorFactory.create().validate(this);

		if (this.notification.hasError())
			throw new NotificationError(this.notification.getErrors());
	}
}
