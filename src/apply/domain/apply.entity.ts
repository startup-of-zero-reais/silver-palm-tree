import Entity from '@/@shared/entity/entity.abstract';
import { Candidate } from '@/candidate/domain';
import JobAd from '@/job/domain/entity/job.entity';

export enum Status {
	INTENT = 'INTENT',
	FINISHED = 'FINISHED',
}

export type State = {
	id?: string;
	jobID: string;
	job?: JobAd;
	candidateID: string;
	candidate?: Candidate;
	status: Status;
	createdAt?: Date;
	updatedAt?: Date;
};

export class Apply extends Entity {
	constructor(private readonly _state: State) {
		super(_state.id, _state.createdAt, _state.updatedAt);
	}

	get jobID(): string {
		return this._state.jobID;
	}

	get job(): JobAd {
		return this._state.job;
	}

	get candidateID(): string {
		return this._state.candidateID;
	}

	get candidate(): Candidate {
		return this._state.candidate;
	}

	get status(): Status {
		return this._state.status;
	}

	public attachJob(job: JobAd) {
		this._state.job = job;
	}

	public attachCandidate(candidate: Candidate) {
		this._state.candidate = candidate;
	}

	public startApply() {
		this._state.status = Status.INTENT;
	}

	public finishApply() {
		this._state.status = Status.FINISHED;
	}
}
