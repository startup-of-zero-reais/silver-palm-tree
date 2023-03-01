import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Status } from '@/apply/domain/apply.entity';
import { Candidate } from '@/candidate/infra/repository/mongo/candidate.model';
import { JobAdView } from '@/job/infra/repository/mongo/job-ad.model';

export type ApplyDocument = HydratedDocument<Apply>;

@Schema()
export class Apply {
	@Prop({ type: mongoose.Types.ObjectId })
	_id?: string;

	@Prop({ ref: JobAdView.name })
	job: JobAdView;

	@Prop({ ref: Candidate.name })
	candidate: Candidate;

	@Prop({ enum: Status, default: Status.INTENT })
	status: Status;

	@Prop()
	createdAt?: Date;

	@Prop()
	updatedAt?: Date;
}

export const ApplySchema = SchemaFactory.createForClass(Apply);
