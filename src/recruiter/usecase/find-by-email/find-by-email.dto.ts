import { IsEmail, IsNotEmpty } from 'class-validator';
import { FindRecruiterOutputDto } from '../find/find.recruiter.dto';

export class FindByEmailInputDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;
}

export class FindByEmailOutputDto extends FindRecruiterOutputDto {}
