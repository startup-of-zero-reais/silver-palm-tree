import { Exclude, Expose, Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { Status } from '@/job/domain/entity/job.entity';

export class FindJobInputDto {
	@IsUUID()
	id: string;
}

@Exclude()
export class FindJobOutputDto {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	description: string;

	@Expose()
	@Transform(({ obj }) => obj.salaryStr)
	salary: string;

	@Expose()
	status: Status;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;
}