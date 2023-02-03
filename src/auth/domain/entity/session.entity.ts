import { addSeconds } from 'date-fns';
import { createDate } from '@/@shared/helpers/create-date';
import { parseTime } from '@/@shared/helpers/parse-time';

export type Props = {
	id?: string;
	token: string;
	cid?: string;
	rid?: string;
	createdAt?: string;
};

export default class Session {
	constructor(private _props: Props) {}

	get id(): string {
		if (!this._props.id) {
			this._props.id = Buffer.from(
				[this._props.cid, this._props.rid].join(':'),
			).toString('base64');
		}

		return this._props.id;
	}

	get token(): string {
		return this._props.token;
	}

	get cid(): string | undefined {
		return this._props.cid;
	}

	get rid(): string | undefined {
		return this._props.rid;
	}

	get createdAt(): Date {
		return createDate(this._props.createdAt);
	}

	isValidSession(): boolean {
		const expiresIn = parseTime(process.env.SESSION_TIME);
		const createdAt = new Date(this._props.createdAt);

		const now = new Date();

		const expiresAt = addSeconds(createdAt, expiresIn);

		return now < expiresAt;
	}
}
