import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProfessionalExperience } from './professional-experience.model';
import { Techs } from './techs.model';

export type CandidateDocument = HydratedDocument<Candidate>;

@Schema()
export class Candidate {
  @Prop({ type: mongoose.Types.ObjectId })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  image: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop([Techs])
  techs: Techs[];

  @Prop([ProfessionalExperience])
  professionalExperiences: ProfessionalExperience[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
