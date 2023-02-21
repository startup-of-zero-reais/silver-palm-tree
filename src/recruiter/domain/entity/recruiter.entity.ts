import BaseUser, {
	BaseUserProps,
	NotUpdableProps,
} from '@/@shared/entity/user.base';
import NotificationError from '@/@shared/notification/notification.error';
import Company from '@/company/domain/entity/company.entity';
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
		isAdmin?: boolean;
	};
} & BaseUserProps;

type UpdateProps = Partial<Props>;

export default class Recruiter extends BaseUser {
	private _status: Status;
	private _companyID: string;
	private _companyCNPJ: string;
	private _isCompanyAdmin: boolean;
	private _company: Company;

	constructor(props: Props) {
		super(props);

		this._status = props.status;
		this._companyID = props.company.id;
		this._companyCNPJ = props.company.cnpj;
		this._isCompanyAdmin = props.company.isAdmin ?? false;
	}

	canLogin(): boolean {
		return this._status !== Status.BLOCKED;
	}

	canInteract(): boolean {
		if (!this._company || this._company.canInteract()) return false;

		return this._status === Status.ACTIVATED;
	}

	update(props: Omit<UpdateProps, NotUpdableProps>): void {
		const { name, image, status } = props;

		if (name) this._name = name;
		if (image) this._image = image;
		if (status) this._status = status;

		this.validate();
	}

	validate(): void {
		RecruiterValidatorFactory.create().validate(this);

		if (this.notification.hasError())
			throw new NotificationError(this.notification.getErrors());
	}

	changeStatus(status: Status): void {
		this._status = status;
	}

	get status(): Status {
		return this._status;
	}

	get companyID(): string {
		return this._company?.id ?? this._companyID;
	}

	get companyCNPJ(): string {
		return this._company?.cnpj ?? this._companyCNPJ;
	}

	get isCompanyAdmin(): boolean {
		return this._company?.adminID == this._id;
	}

	public attachCompany(company: Company) {
		this._company = company;
	}
}
