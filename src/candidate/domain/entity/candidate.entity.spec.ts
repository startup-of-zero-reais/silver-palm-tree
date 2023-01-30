import { ProfessionalExperience } from '../value-object/professional-experience';
import Techs, { KnowledgeLevel } from '../value-object/techs-value-object';
import Candidate from './candidate.entity';

const makeEntity = () =>
	new Candidate({
		email: 'foo@bar.com',
		name: 'foo',
		image: 'https://www.github.com/Vicenteefenequis',
		phone: 'any_phone',
		password: 'any_password',
		professionalExperiences: [
			new ProfessionalExperience({
				acting_time: '1 year',
				company: 'Vacancies',
				description: 'any_description',
				qualification: 'any_qualitifation',
				role: 'Developer Frontend',
			}),
		],
		techs: [
			new Techs({
				knowledge_level: KnowledgeLevel.ADVANCED,
				tech: 'any_tech',
			}),
		],
	});

describe('Domain > Candidate', () => {
	it('Should create a candidate', () => {
		const candidate = makeEntity();
		expect(candidate.id).toBeDefined();
		expect(candidate.name).toBe('foo');
		expect(candidate.image).toBe('https://www.github.com/Vicenteefenequis');
		expect(candidate.email).toBe('foo@bar.com');
		expect(candidate.phone).toBe('any_phone');
		expect(candidate.techs.length).toBe(1);
		expect(candidate.techs[0].knowledge_level).toBe(
			KnowledgeLevel.ADVANCED,
		);
		expect(candidate.techs[0].tech).toBe('any_tech');
	});

	it('Should Candidate throws error', () => {
		expect(() => {
			new Candidate({
				email: '',
				name: '',
				image: '',
				phone: '',
				password: '',
				techs: [],
				professionalExperiences: [],
			});
		}).toThrowError(
			[
				'name must be at least 2 characters',
				'name is a required field',
				'email is a required field',
				'image is a required field',
				'phone is a required field',
				'techs field must have at least 1 items',
			].join(','),
		);
	});

	it('Should Candidate update', () => {
		const candidate = makeEntity();
		candidate.update({
			name: 'bar',
			image: 'http://localhost.com',
			phone: '00000000',
			techs: [
				new Techs({
					knowledge_level: KnowledgeLevel.ADVANCED,
					tech: 'PHP',
				}),
				new Techs({
					knowledge_level: KnowledgeLevel.INTERMEDIATE,
					tech: 'TYPESCRIPT',
				}),
			],
		});

		expect(candidate.name).toBe('bar');
		expect(candidate.image).toBe('http://localhost.com');
		expect(candidate.phone).toBe('00000000');
		expect(candidate.techs.length).toBe(2);
		expect(candidate.techs[0].knowledge_level).toBe(
			KnowledgeLevel.ADVANCED,
		);
		expect(candidate.techs[0].tech).toBe('PHP');
		expect(candidate.techs[1].knowledge_level).toBe(
			KnowledgeLevel.INTERMEDIATE,
		);
		expect(candidate.techs[1].tech).toBe('TYPESCRIPT');
	});

	it('Should candidate not update when passing undefined param', () => {
		const candidate = makeEntity();
		candidate.update({
			name: 'name update',
			image: undefined,
			phone: undefined,
			techs: undefined,
		});
		expect(candidate.name).toBe('name update');
		expect(candidate.image).toBe('https://www.github.com/Vicenteefenequis');
		expect(candidate.email).toBe('foo@bar.com');
		expect(candidate.phone).toBe('any_phone');
		expect(candidate.techs.length).toBe(1);
		expect(candidate.techs[0].knowledge_level).toBe(
			KnowledgeLevel.ADVANCED,
		);
		expect(candidate.techs[0].tech).toBe('any_tech');
	});
});
