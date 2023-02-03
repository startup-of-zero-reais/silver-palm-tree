import { randomUUID } from 'crypto';
import Notification from '../notification/notification';

export default abstract class Entity {
	protected _id: string;
	protected _createdAt: Date;
	protected _updatedAt: Date;
	public notification: Notification;

	constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
		this.notification = new Notification();
		this._id = id || randomUUID();
		this._createdAt = createdAt ? createdAt : new Date();
		this._updatedAt = updatedAt ? updatedAt : new Date();
	}
	get id(): string {
		return this._id;
	}
	get createdAt(): Date {
		return this._createdAt;
	}
	get updatedAt(): Date {
		return this._updatedAt;
	}
}
