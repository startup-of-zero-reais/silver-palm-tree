import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { KnowledgeLevel } from '@/candidate/domain';

export type TechsDocument = HydratedDocument<Techs>;

@Schema()
export class Techs {
  @Prop()
  tech: string;

  @Prop({ enum: KnowledgeLevel })
  knowledge_level: KnowledgeLevel;
}

export const TechsSchema = SchemaFactory.createForClass(Techs);
