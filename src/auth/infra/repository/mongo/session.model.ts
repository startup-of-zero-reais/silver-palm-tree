import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
	@Prop({ type: mongoose.Types.ObjectId })
	_id: string;

	@Prop({ required: true })
	token: string;

	@Prop({ index: true })
	cid: string;

	@Prop({ index: true })
	rid: string;

	@Prop()
	createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
