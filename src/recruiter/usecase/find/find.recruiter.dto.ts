import { Exclude, Expose, plainToClass, Transform } from 'class-transformer';

@Exclude()
export class FindRecruiterOutputDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  status: string;

  @Expose()
  @Transform(({ value }) => plainToClass(CompanyOutputDto, value))
  company: CompanyOutputDto;
}

@Exclude()
export class CompanyOutputDto {
  @Expose()
  id: string;

  @Expose()
  cnpj: string;
}
