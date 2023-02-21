import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from '@/company/infra/repository/mongo/company.model';
import { Status } from '@/recruiter/domain';

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

	@Prop({ ref: Company.name })
	company: Company;

	@Prop()
	createdAt?: Date;

	@Prop()
	updatedAt?: Date;
}

export const RecruiterSchema = SchemaFactory.createForClass(Recruiter);
