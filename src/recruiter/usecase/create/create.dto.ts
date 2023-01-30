import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateInputDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsNotEmpty()
  @Length(6, 64)
  password: string;

  @IsNotEmpty()
  cnpj: string;
}

@Exclude()
export class CreateOutputDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;
}
