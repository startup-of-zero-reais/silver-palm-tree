import axios from 'axios';
import { RecruiterSchema } from '../src/recruiter/infra/repository/mongo/recruiter.model';
import { getMongoInstance } from './cli';

export async function getAuthOf(recruiter) {
	const auth = await axios({
		method: 'POST',
		url: 'http://localhost:3000/auth/login',
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify({
			email: recruiter.email,
			password: recruiter.password,
		}),
	})
		.then(({ headers }) => headers['session'])
		.catch((e) => console.log(e.response.data.message));

	return { Authorization: `Bearer ${auth}` };
}

export async function getRecruiters() {
	const conn = await getMongoInstance();
	const recruiterModel = conn.model('Recruiter', RecruiterSchema);
	return await recruiterModel.find({}, { email: 1 }).then((res) =>
		res.map((recruiter) => {
			return {
				email: recruiter.email,
				password: '123456',
			};
		}),
	);
}
