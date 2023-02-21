import { faker } from '@faker-js/faker';
import axios from 'axios';
import { getMongoInstance, parseFlags } from './cli';
import { getAuthOf, getRecruiters } from './helpers';

function singleJob() {
	return {
		title: faker.company.bsAdjective() + ' ' + faker.commerce.department(),
		description: faker.random.words(80),
		salary: +faker.random.numeric(6),
		hideSalary: faker.datatype.boolean(),
		contracts: faker.helpers.arrayElements(
			['CLT', 'Temporário', 'Estágio', 'Flex', 'Autonomo'],
			2,
		),
		techs: faker.helpers.arrayElements(
			[
				'Golang',
				'PHP',
				'NodeJS',
				'Figma',
				'Adobe XD',
				'Python',
				'React',
				'React Native',
			],
			2,
		),
		availability: faker.helpers.arrayElement([
			'Home office',
			'Hibrido',
			'Presencial',
		]),
	};
}

const recruiters = getRecruiters();

async function postJob(job) {
	const canBeOwner = await recruiters;
	const owner = canBeOwner[Math.floor(Math.random() * canBeOwner.length)];
	const auth = await getAuthOf(owner);

	if (auth === null) {
		console.log(`can not post job to ${owner.email}`);
		return;
	}

	const id = await axios({
		method: 'POST',
		url: 'http://localhost:3000/jobs',
		headers: {
			'Content-Type': 'application/json',
			...auth,
		},
		data: JSON.stringify(job),
	})
		.then(({ data }) => data.id)
		.catch((e) => {
			console.log(`job was NOT created: ${e.response.data.error}`);
		});

	if (id) {
		await axios({
			method: 'PATCH',
			url: `http://localhost:3000/jobs/${id}/activate?root=root`,
			headers: {
				'Content-Type': 'application/json',
				...auth,
			},
		}).then(({ status }) => {
			if (status !== 200) console.log(`job ${id} was NOT activated`);
			console.log(`job ${id} was activated`);
		});
	}
}

export async function seedJobs() {
	const { length = 50, reseed } = parseFlags();

	console.log(`generating ${length} jobs...`);
	const jobs = await Promise.all(Array.from({ length }).map(singleJob));

	if (reseed) {
		console.log(`reseeding jobs`);
		const conn = await getMongoInstance();
		await Promise.all([
			conn.dropCollection('jobads'),
			conn.dropCollection('jobads_view'),
		]);
	}

	console.log(`seeding jobs`);
	await Promise.all(jobs.map(postJob));
	console.log(`jobs was seed...`);
	process.exit(0);
}

seedJobs();
