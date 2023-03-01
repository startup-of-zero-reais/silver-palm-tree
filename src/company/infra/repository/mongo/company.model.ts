import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Status } from '@/recruiter/domain';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
	@Prop({ type: mongoose.Types.ObjectId })
	_id: string;

	@Prop()
	cnpj: string;

	@Prop()
	logo: string;

	@Prop()
	description: string;

	@Prop({ enum: Status })
	status: Status;

	@Prop()
	admin: string;

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
