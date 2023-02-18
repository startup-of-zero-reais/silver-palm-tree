import {
	IsArray,
	IsBoolean,
	IsEmpty,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MinLength,
} from 'class-validator';
import { MaxArrayLength } from '@/@shared/decorator/max-array-length.decorator';

export class CreateJobInputDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	@MinLength(30)
	description: string;

	@IsEmpty()
	owner: string;

	@IsEmpty()
	companyID: string;

	@IsNotEmpty()
	@IsNumber()
	@IsInt()
	@IsPositive()
	salary: number;

	@IsOptional()
	@IsBoolean()
	hideSalary?: boolean;

	@IsOptional()
	@IsArray()
	@MaxArrayLength(2)
	contracts?: string[];

	@IsOptional()
	@IsArray()
	techs?: string[];

	@IsString()
	@IsNotEmpty()
	availability: string;
}
