import { Exclude, Expose } from 'class-transformer';
import {
	IsNotEmpty,
	MinLength,
	IsEmpty,
	IsNumber,
	IsInt,
	IsPositive,
	IsOptional,
	IsBoolean,
	IsArray,
	IsString,
} from 'class-validator';
import { MaxArrayLength } from '@/@shared/decorator/max-array-length.decorator';
import { UpdateJobEventProps } from '@/job/domain/events/job-ad.updated.event';

@Exclude()
export class UpdateInputDTO implements UpdateJobEventProps {
	@Expose()
	@IsEmpty()
	id: string;

	@Expose()
	@IsEmpty()
	editor: string;

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	title?: string;

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@MinLength(30)
	description?: string;

	@Expose()
	@IsOptional()
	@IsNotEmpty()
	@IsNumber()
	@IsInt()
	@IsPositive()
	salary?: number;

	@Expose()
	@IsOptional()
	@IsBoolean()
	hideSalary?: boolean;

	@Expose()
	@IsOptional()
	@IsArray()
	@MaxArrayLength(2)
	contracts?: string[];

	@Expose()
	@IsOptional()
	@IsArray()
	techs?: string[];

	@Expose()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	availability?: string;
}
