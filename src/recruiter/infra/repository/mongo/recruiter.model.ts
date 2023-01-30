import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Status } from '@/recruiter/domain';
import { Company } from './company.model';

export type RecruiterDocument = HydratedDocument<Recruiter>;

@Schema()
export class Recruiter {
	@Prop({ type: mongoose.Types.ObjectId })
	_id: string;

	@Prop()
	name: string;

	@Prop({ index: true })
	email: string;

	@Prop()
	image: string;

	@Prop()
	password: string;

	@Prop({ enum: Status })
	status: Status;

	@Prop(Company)
	company: Company;

	@Prop()
	createdAt?: Date;

	@Prop()
	updatedAt?: Date;
}

export const RecruiterSchema = SchemaFactory.createForClass(Recruiter);
