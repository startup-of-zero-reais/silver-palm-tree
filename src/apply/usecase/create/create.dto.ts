import { IsEmpty, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateApplyInputDTO {
	@IsNotEmpty()
	@IsUUID(4)
	jobID: string;

	@IsEmpty()
	candidateID: string;
}
