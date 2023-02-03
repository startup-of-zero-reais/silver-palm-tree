import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
	@Prop()
	id: string;

	@Prop()
	cnpj: string;

	@Prop({ default: false })
	isAdmin: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
