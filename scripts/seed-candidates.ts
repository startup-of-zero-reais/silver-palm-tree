import { faker } from '@faker-js/faker';
import axios from 'axios';
import { getMongoInstance, parseFlags } from './cli';

function generateTech() {
	return {
		tech: faker.helpers.arrayElement([
			'Golang',
			'PHP',
			'NodeJS',
			'Java',
			'Figma',
			'Adobe XD',
			'Python',
		]),
		knowledge_level: faker.helpers.arrayElement([
			'BEGINNER',
			'INTERMEDIATE',
			'ADVANCED',
		]),
	};
}

function generateExperience() {
	return {
		company: faker.company.name(),
		role: faker.commerce.department(),
		action_time: `${faker.random.numeric()} years`,
		description: faker.random.words(20),
		qualification: faker.random.words(5),
	};
}

async function singleUser() {
	const gender = faker.datatype.boolean() ? 'male' : 'female';

	await axios({
		method: 'GET',
		url: 'https://randomuser.me/api',
		params: {
			gender,
			inc: 'picture',
		},
	});

	const firstName = faker.name.firstName(gender);
	const lastName = faker.name.lastName(gender);
	const name = `${firstName} ${lastName}`;

	return {
		name,
		email: faker.internet.email(firstName, lastName).toLowerCase(),
		image: `https://randomuser.me/api/portraits/men/19.jpg`,
		phone: faker.phone.number('+55###########'),
		password: faker.internet.password(),
		techs: Array.from({ length: +faker.random.numeric(1) }).map(
			generateTech,
		),
		professionalExperiences: Array.from({
			length: +faker.random.numeric(1),
		}).map(generateExperience),
	};
}

async function postCandidate(candidate) {
	return await axios({
		method: 'POST',
		url: 'http://localhost:3000/candidates',
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify(candidate),
	}).catch((e) => console.log(e.response.data.message));
}

export async function seedCandidates() {
	const { length = 3, reseed } = parseFlags();

	console.log(`generating ${length} candidates...`);
	const candidates = await Promise.all(
		Array.from({ length }).map(singleUser),
	);

	if (reseed) {
		console.log(`reseeding candidates`);
		const conn = await getMongoInstance();
		await conn.dropCollection('candidates');
	}

	await Promise.all(candidates.map(postCandidate));
	console.log(`candidates was seed...`);
	process.exit(0);
}

seedCandidates();
