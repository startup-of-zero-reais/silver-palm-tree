import Entity from '@/@shared/entity/entity.abstract';
import NotificationError from '@/@shared/notification/notification.error';
import { CompanyValidatorFactory } from '../factory/company.validator.factory';

export enum Status {
	// INSPECTION status is to new recruiters
	INSPECTION = 'INSPECTION',
	// ACTIVATED status is when recruiter is approved by company admin
	ACTIVATED = 'ACTIVATED',
	// BLOCKED status is when recruiter can not do nothing as recruiter
	BLOCKED = 'BLOCKED',
}

export type Props = {
	id?: string;
	logo: string;
	cnpj: string;
	description: string;
	status?: Status;
	createdAt?: Date;
	updatedAt?: Date;
};

export default class Company extends Entity {
	private _logo: string;
	private _cnpj: string;
	private _description: string;
	private _status?: Status;

	constructor(props: Props) {
		super(props.id, props.createdAt, props.updatedAt);
		this._logo = props.logo;
		this._cnpj = props.cnpj;
		this._description = props.description;
		this._status = props.status || Status.INSPECTION;
		this.validate();
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

	get status(): Status {
		return this._status;
	}

	update(
		props: Omit<
			Props,
			'id' | 'createdAt' | 'updatedAt' | 'cnpj' | 'status'
		>,
	) {
		const { description, logo } = props;
		if (description) this._description = description;
		if (logo) this._logo = logo;

		this.validate();
		this._updatedAt = new Date();
	}

	changeStatus(status: Status) {
		this._status = status;
	}

	validate() {
		CompanyValidatorFactory.create().validate(this);

		if (this.notification.hasError())
			throw new NotificationError(this.notification.getErrors());
	}
}
