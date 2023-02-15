import { IsUUID } from 'class-validator';

export class RefreshJobInputDTO {
	@IsUUID()
	id: string;

	@IsUUID()
	requirer: string;
}
