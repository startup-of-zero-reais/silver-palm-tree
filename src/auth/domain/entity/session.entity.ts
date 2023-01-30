export type Props = {
	id: string;
	token: string;
	cid?: string;
	rid?: string;
	createdAt: string;
};

export default class Session {
	constructor(private _props: Props) {}

	get id(): string {
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

	isValidSession(): boolean {
		const expiresIn = this.parseExpirationTime(process.env.SESSION_TIME);
		const now = new Date();
		const createdAt = new Date(this._props.createdAt);

		createdAt.setSeconds(expiresIn);

		return now < createdAt;
	}

	private parseExpirationTime(env: string): number {
		const scales = {
			d: 60 * 60 * 24,
			m: 60,
			s: 1,
		};

		const scale = env.replace(/\d+/, '');
		const time = Number(env.replace(/[dms]/, ''));

		if (isNaN(time)) {
			throw new Error('invalid session time env');
		}

		const timeInS = time * scales[scale];
		return timeInS;
	}
}
