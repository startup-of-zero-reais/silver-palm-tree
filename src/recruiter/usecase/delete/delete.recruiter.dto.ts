import { IsNotEmpty, IsOptional } from 'class-validator';

export class DeleteRecruiterInputDto {
	@IsNotEmpty()
	@IsOptional()
	id: string;
}
