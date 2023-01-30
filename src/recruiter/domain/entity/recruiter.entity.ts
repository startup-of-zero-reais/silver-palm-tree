import BaseUser, {
	BaseUserProps,
	NotUpdableProps,
} from '@/@shared/entity/user.base';
import NotificationError from '@/@shared/notification/notification.error';
import RecruiterValidatorFactory from '../factory/recruiter.validator.factory';

export enum Status {
	// INSPECTION status is to new recruiters
	INSPECTION = 'INSPECTION',
	// ACTIVATED status is when recruiter is approved by company admin
	ACTIVATED = 'ACTIVATED',
	// BLOCKED status is when recruiter can not do nothing as recruiter
	BLOCKED = 'BLOCKED',
}

export type Props = {
	status: Status;
	company: {
		id: string;
		cnpj: string;
	};
} & BaseUserProps;

type UpdateProps = Partial<Props>;

export default class Recruiter extends BaseUser {
	private _status: Status;
	private _companyID: string;
	private _companyCNPJ: string;

	constructor(props: Props) {
		super(props);

		this._status = props.status;
		this._companyID = props.company.id;
		this._companyCNPJ = props.company.cnpj;
	}

	canLogin(): boolean {
		return this._status !== Status.BLOCKED;
	}

	canInteract(): boolean {
		return this._status === Status.ACTIVATED;
	}

	update(props: Omit<UpdateProps, NotUpdableProps>): void {
		const { name, image } = props;

		if (name) this._name = name;
		if (image) this._image = image;

		this.validate();
	}

	validate(): void {
		RecruiterValidatorFactory.create().validate(this);

		if (this.notification.hasError())
			throw new NotificationError(this.notification.getErrors());
	}

	get status(): Status {
		return this._status;
	}

	get companyID(): string {
		return this._companyID;
	}

	get companyCNPJ(): string {
		return this._companyCNPJ;
	}
}
