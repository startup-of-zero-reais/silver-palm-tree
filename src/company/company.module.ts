import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyFacade } from './facade/company.facade';

@Module({
  providers: [CompanyFacade],
  controllers: [CompanyController],
  exports: [CompanyFacade],
})
export class CompanyModule {}
