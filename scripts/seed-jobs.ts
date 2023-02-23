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
		location: faker.helpers.arrayElement([
			'Abadia de Goiás',
			'Águas Lindas de Goiás',
			'Alvorada do Norte',
			'Anápolis',
			'Aparecida de Goiânia',
			'Aragarças',
			'Aragoiânia',
			'Aparecida do Rio Doce',
			'Aurilândia',
			'Caçu',
			'Caldazinha',
			'Campinorte',
			'Cavalcante',
			'Corumbaíba',
			'Goiás',
			'Damianópolis',
			'Damolândia',
			'Davinópolis',
			'Abadiânia',
			'Acreúna',
			'Adelândia',
			'Água Fria de Goiás',
			'Água Limpa',
			'Alexânia',
			'Aloândia',
			'Alto Horizonte',
			'Alto Paraíso de Goiás',
			'Amaralina',
			'Americano do Brasil',
			'Amorinópolis',
			'Anhanguera',
			'Anicuns',
			'Aporé',
			'Araçu',
			'Araguapaz',
			'Arenópolis',
			'Aruanã',
			'Avelinópolis',
			'Baliza',
			'Bom Jardim de Goiás',
			'Bom Jesus de Goiás',
			'Bonópolis',
			'Brazabrantes',
			'Britânia',
			'Buriti Alegre',
			'Buriti de Goiás',
			'Buritinópolis',
			'Cabeceiras',
			'Cachoeira Alta',
			'Cachoeira de Goiás',
			'Cachoeira Dourada',
			'Caiapônia',
			'Caldas Novas',
			'Campestre de Goiás',
			'Campinaçu',
			'Campo Alegre de Goiás',
			'Campo Limpo de Goiás',
			'Campos Belos',
			'Campos Verdes',
			'Carmo do Rio Verde',
			'Castelândia',
			'Catalão',
			'Caturaí',
			'Ceres',
			'Cezarina',
			'Chapadão do Céu',
			'Cidade Ocidental',
			'Cocalzinho de Goiás',
			'Colinas do Sul',
			'Córrego do Ouro',
			'Corumbá de Goiás',
			'Cristianópolis',
			'Cromínia',
			'Cumari',
			'Diorama',
			'Divinópolis de Goiás',
			'Edealina',
			'Edéia',
			'Faina',
			'Fazenda Nova',
			'Firminópolis',
			'Flores de Goiás',
			'Formosa',
			'Formoso',
			'Gameleira de Goiás',
			'Goianápolis',
			'Goianésia',
			'Goiatuba',
			'Gouvelândia',
			'Guapó',
			'Guaraíta',
			'Guarani de Goiás',
			'Guarinos',
			'Heitoraí',
			'Bandeira de Hidrolina.jpeg Hidrolina',
			'Iaciara',
			'Inaciolândia',
			'Indiara',
			'Inhumas',
			'Ipiranga de Goiás',
			'Israelândia',
			'Itaguari',
			'Itapirapuã',
			'Itapuranga',
			'Itarumã',
			'Ivolândia',
			'Jandaia',
			'Jaupaci',
			'Jesúpolis',
			'Joviânia',
			'Jussara',
			'Leopoldo de Bulhões',
			'Mairipotaba',
			'Mara Rosa',
			'Mimoso de Goiás',
			'Monte Alegre de Goiás',
			'Montes Claros de Goiás',
			'Montividiu do Norte',
			'Montividiu',
			'Morrinhos',
			'Morro Agudo de Goiás',
			'Mozarlândia',
			'Mutunópolis',
			'Nova América',
			'Nova Aurora',
			'Nova Iguaçu de Goiás',
			'Nova Roma',
			'Novo Gama',
			'Novo Planalto',
			'Ouvidor',
			'Palestina de Goiás',
			'Palmelo',
			'Palminópolis',
			'Panamá',
			'Perolândia',
			'Petrolina de Goiás',
			'Pilar de Goiás',
			'Piranhas',
			'Pontalina',
			'Porangatu',
			'Rialma',
			'Rianápolis',
			'Rio Quente',
			'Rubiataba',
			'Sanclerlândia',
			'Santa Bárbara de Goiás',
			'Santa Rita do Araguaia',
			'Santa Tereza de Goiás',
			'Santa Terezinha de Goiás',
			'Santo Antônio da Barra',
			'São Domingos',
			'São Luiz do Norte',
			'São Miguel do Passa-Quatro',
			'Senador Canedo',
			'Serranópolis',
			'Teresina de Goiás',
			'Terezópolis de Goiás',
			'Três Ranchos',
			'Trombas',
			'Turvelândia',
			'Urutaí',
			'Varjão',
			'Vianópolis',
			'Simolândia',
			'Estrela do Norte',
			'Goiandira',
			'Itaguaru',
			'Itapaci',
			'Jaraguá',
			'Mambaí',
			'Marzagão',
			'Matrinchã',
			'Moiporá',
			'Doverlândia',
			'Nazário',
			'Nova Glória',
			'Nova Veneza',
			'Orizona',
			'Ouro Verde de Goiás',
			'Paraúna',
			'Mossâmedes',
			'Piracanjuba',
			'Pirenópolis',
			'Porteirão',
			'Portelândia',
			'Professor Jamil',
			'Quirinópolis',
			'Santo Antônio do Descoberto',
			'Santa Cruz de Goiás',
			'Santa Fé de Goiás',
			'Santa Isabel',
			'Santa Rita do Novo Destino',
			'Santa Rosa de Goiás',
			'São João da Paraúna',
			'São Patrício',
			'Silvânia',
			"Sítio d'Abadia",
			'Taquaral de Goiás',
			'Turvânia',
			'Uirapuru',
			'Uruana',
			'Vicentinópolis',
			'Vila Propício',
			'Ipameri',
			'Crixás',
			'Minaçu',
			'Itajá',
			'Lagoa Santa',
			'Bandeiramineiros.jpeg Mineiros',
			'Paranaiguara',
			'São Simão',
			'Niquelândia',
			'Bela Vista de Goiás',
			'Bonfinópolis',
			'Cristalina',
			'Flag of Barro Alto (Goiás).svg Barro Alto',
			'Flag of Itauçu.svg Itauçu',
			'Itumbiara',
			'Goiânia',
			'Goianira',
			'Hidrolândia',
			"São João d'Aliança",
			'Iporá',
			'Itaberaí',
			'Jataí',
			'Luziânia',
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
