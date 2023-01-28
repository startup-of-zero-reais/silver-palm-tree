import { IsEmail, IsNotEmpty } from 'class-validator';
import { FindOutputDto } from '../find/find.dto';

export class FindByEmailInputDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class FindByEmailOutputDto extends FindOutputDto {
  public password: string;
}
