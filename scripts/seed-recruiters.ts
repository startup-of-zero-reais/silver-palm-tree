import { faker } from '@faker-js/faker';
import axios from 'axios';
import { getMongoInstance, parseFlags } from './cli';
import { getAuthOf } from './helpers';

function cnpj() {
	const nums = [];

	const randomize = () => {
		return Math.round(Math.random() * 9);
	};

	const mod = (dividendo, divisor) => {
		return Math.round(
			dividendo - Math.floor(dividendo / divisor) * divisor,
		);
	};

	const result = '##############'
		.replaceAll('#', (substr, index) => {
			if (index < 8) {
				const n = randomize();
				nums.push(n);
				return n.toString();
			}

			if ([8, 9, 10].includes(index)) {
				nums.push(0);
				return '0';
			}

			if (11 === index) {
				nums.push(1);
				return '1';
			}

			if (index === 12) {
				let d1 = nums
					.sort(() => -1)
					.reduce((acc, num, i) => {
						const multiplier = i + 2;
						const d = multiplier <= 9 ? multiplier : multiplier - 8;
						return acc + num * d;
					}, 0);

				d1 = 11 - mod(d1, 11);
				if (d1 >= 10) d1 = 0;

				nums.sort(() => -1).push(d1);
				return d1.toString();
			}

			if (index === 13) {
				let d2 = nums
					.sort(() => -1)
					.reduce((acc, num, i) => {
						const multiplier = i + 2;
						const d = multiplier <= 9 ? multiplier : multiplier - 8;
						return acc + num * d;
					}, 0);

				d2 = 11 - mod(d2, 11);
				if (d2 >= 10) d2 = 0;

				nums.sort(() => -1).push(d2);
				return d2.toString();
			}

			return substr;
		})
		.split('')
		.map((c, i) => {
			if ([2, 5].includes(i)) return `.${c}`;
			if (i == 8) return `/${c}`;
			if (i == 12) return `-${c}`;
			return c;
		})
		.join('');

	return result;
}

function generateCompany() {
	const logoPlaceholder = (txt) => {
		const color = faker.color
			.rgb()
			.replace(/^[0x\#]+/, '')
			.toUpperCase();

		return `https://via.placeholder.com/350/${color}/000000?text=${encodeURI(
			txt,
		)}`;
	};

	const description = faker.company.name();

	return {
		logo: logoPlaceholder(description),
		description,
		cnpj: cnpj(),
	};
}

async function singleRecruiter() {
	const gender = faker.datatype.boolean() ? 'male' : 'female';

	const image = await axios({
		method: 'GET',
		url: 'https://randomuser.me/api',
		params: {
			gender,
			inc: 'picture',
		},
	})
		.then(({ data }) => data.results?.[0].picture.large)
		.catch(() => `https://randomuser.me/api/portraits/men/19.jpg`);

	const firstName = faker.name.firstName(gender);
	const lastName = faker.name.lastName(gender);
	const name = `${firstName} ${lastName}`;

	return {
		name,
		email: faker.internet.email(firstName, lastName).toLowerCase(),
		image,
		password: '123456',
		company: generateCompany(),
	};
}

async function postRecruiter(recruiter) {
	const id = await axios({
		method: 'POST',
		url: 'http://localhost:3000/recruiters',
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify(recruiter),
	})
		.then(({ data }) => data.id)
		.catch(() => null);

	await axios({
		method: 'PATCH',
		url: `http://localhost:3000/recruiters/${id}?root=root`,
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify({ status: 'ACTIVATED' }),
	})
		.then(() => console.log(`recruiter ${recruiter.name} was ACTIVATED`))
		.catch(() =>
			console.log(`can NOT ACTIVATE recruiter ${recruiter.name}`),
		);

	if (id) {
		const headers = await getAuthOf(recruiter);

		if (headers == null) {
			console.log(`Auth failed to recruiter ${recruiter.id}`);
			return;
		}

		await axios({
			method: 'PATCH',
			url: 'http://localhost:3000/companies',
			headers: {
				'Content-Type': 'application/json',
				...headers,
			},
			data: JSON.stringify({ status: 'ACTIVATED' }),
		})
			.then(({ status }) => {
				if (status !== 201) {
					throw new Error(
						`recruiter ${recruiter.name} fail activating company`,
					);
				}

				console.log(
					`recruiter ${recruiter.name} has company activated`,
				);
			})
			.catch((e) => console.log(`can not activate company ${e.message}`));
	}
}

export async function seedRecruiters() {
	const { length = 3, reseed } = parseFlags();

	console.log(`generating ${length} recruiters with their companies...`);
	const recruiters = await Promise.all(
		Array.from({ length }).map(singleRecruiter),
	);

	if (reseed) {
		console.log(`reseeding recruiters and their companies`);
		const conn = await getMongoInstance();
		await Promise.all([
			conn.dropCollection('recruiters'),
			conn.dropCollection('companies'),
		]);
	}

	await Promise.all(recruiters.map(postRecruiter));
	console.log(`recruiters was seed...`);
	process.exit(0);
}

seedRecruiters();
