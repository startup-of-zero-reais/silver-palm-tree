import { randomUUID } from 'crypto';
import { Event } from '../events/event';
import JobAd, { Status } from './job.entity';

const makeJob = () =>
	new JobAd({
		title: 'Programador Back-end',
		description: 'Programador que não dá migué no serviço',
		owner: randomUUID(),
		salary: 300000,
		status: Status.INSPECTION,
		__v: -1,
	});

describe('Domain > Job', () => {
	it('should create a job', () => {
		const job = makeJob();

		expect(job.id).toBeDefined();
		expect(job.title).toBe('Programador Back-end');
		expect(job.description).toBe('Programador que não dá migué no serviço');
		expect(job.owner).toBeDefined();
		expect(job.salaryStr).toBe(`R$\xa03.000,00`); // \xa0 is the space char
		expect(job.status).toBe(Status.INSPECTION);
	});

	it('should apply new event', () => {
		const job = makeJob();

		const events: Event[] = [
			new Event(
				'jobad.created',
				{ status: Status.INSPECTION, title: 'Programador C#' },
				new Date(),
				0,
			),
			new Event(
				'jobad.activated',
				{ status: Status.ACTIVATED },
				new Date(),
				1,
			),
			new Event(
				'jobad.updated',
				{ title: 'Programador PHP' },
				new Date(),
				2,
			),
			new Event(
				'jobad.updated',
				{ description: 'Descrição da vaga atualizada' },
				new Date(),
				3,
			),
			new Event(
				'jobad.updated',
				{ techs: ['Golang', 'PHP'] },
				new Date(),
				4,
			),
		];

		job.putEvents(...events).compileEvents();

		expect(job.title).toBe('Programador PHP');
		expect(job.status).toBe(Status.ACTIVATED);
		expect(job.description).toBe('Descrição da vaga atualizada');
		expect(job.version).toBe(events.length - 1);
		expect(job.techs).toEqual(['Golang', 'PHP']);
	});
});
