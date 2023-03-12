import { Inject, Injectable } from '@nestjs/common';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { Apply } from '../domain/apply.entity';
import { FindByJobIdUseCase } from '../usecase/find-by-job-id/find-by-job-id-usecase';
import ApplyFacadeInterface from './apply.facade.interface';

@Injectable()
export class ApplyFacade implements ApplyFacadeInterface {
	constructor(
		@Inject(FindByJobIdUseCase)
		private readonly findByJobIdUseCase: UseCaseInterface,
	) {}

	async findByJobId(id: string): Promise<Apply[]> {
		return await this.findByJobIdUseCase.execute({ id });
	}
}
