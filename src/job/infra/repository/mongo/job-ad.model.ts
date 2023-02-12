import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Status } from '@/job/domain/entity/job.entity';

@Schema()
export class Job {
	@Prop({ type: mongoose.Types.ObjectId })
	_id?: string;

	@Prop()
	title?: string;

	@Prop()
	description?: string;

	@Prop({ enum: Status })
	status?: Status;

	@Prop()
	salary?: number;

	@Prop()
	hideSalary?: boolean;

	@Prop()
	owner?: string;

	@Prop()
	editors?: string[];

	@Prop()
	createdAt?: Date;

	@Prop()
	updatedAt?: Date;

	@Prop()
	__v?: number = 0;
}

@Schema()
export class Event {
	@Prop({ required: true })
	action: string;

	@Prop(Job)
	data: Job;

	@Prop()
	createdAt?: Date;

	@Prop({ default: 0 })
	__v: number;
}

@Schema()
export class JobAd {
	@Prop({ type: mongoose.Types.ObjectId })
	_id: string;

	@Prop([Event])
	events?: Event[];

	@Prop()
	__v?: number;
}

@Schema({ collection: 'jobads_view', autoCreate: true })
export class JobAdView extends Job {
	@Prop({ type: mongoose.Types.ObjectId })
	_id: string;
}

export type JobDocument = HydratedDocument<Job>;
export type EventDocument = HydratedDocument<Event>;
export type JobAdDocument = HydratedDocument<JobAd>;
export type JobAdViewDocument = HydratedDocument<JobAdView>;

export const JobSchema = SchemaFactory.createForClass(Job);
export const EventSchema = SchemaFactory.createForClass(Event);
export const JobAdSchema = SchemaFactory.createForClass(JobAd);
export const JobAdViewSchema = SchemaFactory.createForClass(JobAdView);
