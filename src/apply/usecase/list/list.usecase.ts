import { Injectable } from '@nestjs/common';
import PaginationPresenter from '@/@shared/repository/presenter/pagination.presenter';
import UseCaseInterface from '@/@shared/usecase/use-case.interface';
import { Apply } from '@/apply/domain/apply.entity';
import { ApplyMongoRepository } from '@/apply/infra/repository/mongo/apply.repository';

@Injectable()
export class ListAppliesUseCase implements UseCaseInterface {
	constructor(private readonly repository: ApplyMongoRepository) {}

	async execute(candidateID: string): Promise<PaginationPresenter<Apply>> {
		return this.repository.findByCandidate(candidateID);
	}
}
