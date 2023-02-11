import { randomUUID } from 'crypto';
import JobAd, { Event, Status } from './job.entity';

const makeJob = () =>
	new JobAd({
		title: 'Programador Back-end',
		description: 'Programador que não dá migué no serviço',
		owner: randomUUID(),
		salary: 300000,
		status: Status.INSPECTION,
		__v: 0,
	});

describe('Domain > Job', () => {
	it('should create a job', () => {
		const job = makeJob();

		expect(job.id).toBeDefined();
		expect(job.title).toBe('Programador Back-end');
		expect(job.description).toBe('Programador que não dá migué no serviço');
		expect(job.owner).toBeDefined();
		expect(job.salary).toBe(`R$\xa03.000,00`); // \xa0 is the space char
		expect(job.status).toBe(Status.INSPECTION);
	});

	it('should apply new event', () => {
		const job = makeJob();

		const events: Event[] = [
			{
				action: 'jobad.created',
				data: { status: Status.INSPECTION, title: 'Programador C#' },
			},
			{
				action: 'jobad.activated',
				data: { status: Status.ACTIVATED },
			},
			{
				action: 'jobad.updated',
				data: { title: 'Programador PHP' },
			},
			{
				action: 'jobad.updated',
				data: { description: 'Descrição da vaga atualizada' },
			},
		];

		job.putEvents(...events);
		job.compileEvents();

		expect(job.title).toBe('Programador PHP');
		expect(job.status).toBe(Status.ACTIVATED);
		expect(job.description).toBe('Descrição da vaga atualizada');
		expect(job.version).toBe(events.length);
	});
});
