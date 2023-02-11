import {
	IsBoolean,
	IsEmpty,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	MinLength,
} from 'class-validator';

export class CreateJobInputDto {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	@MinLength(30)
	description: string;

	@IsEmpty()
	owner: string;

	@IsNotEmpty()
	@IsNumber()
	@IsInt()
	@IsPositive()
	salary: number;

	@IsOptional()
	@IsBoolean()
	hideSalary?: boolean;
}
