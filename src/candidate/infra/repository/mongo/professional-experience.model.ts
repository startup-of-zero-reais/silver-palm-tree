import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfessionalExperienceDocument =
  HydratedDocument<ProfessionalExperience>;

@Schema()
export class ProfessionalExperience {
  @Prop()
  company: string;
  @Prop()
  role: string;
  @Prop()
  acting_time: string;
  @Prop()
  description: string;
  @Prop()
  qualification: string;
}

export const ProfessionalExperienceSchema = SchemaFactory.createForClass(
  ProfessionalExperience,
);
