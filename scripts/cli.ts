import mongoose from 'mongoose';

export function parseFlags() {
	const args = process.argv;

	let length = undefined,
		reseed = false;

	for (const arg of args) {
		const lengthArg = /^--length=(?<length>\d+)/.exec(arg);
		if (lengthArg?.groups?.length) length = +lengthArg.groups.length;

		const reseedArg = /^--reseed/.exec(arg);
		if (reseedArg) reseed = true;
	}

	return {
		length,
		reseed,
	};
}

let dbConn: mongoose.Connection = null;

export async function getMongoInstance() {
	if (dbConn !== null) return dbConn;

	let attempts = 3;

	const connect = () => {
		attempts--;
		dbConn = mongoose.createConnection(
			'mongodb://root:root@localhost:27017',
		);
		return dbConn;
	};

	try {
		return connect();
	} catch (e) {
		if (attempts > 0) {
			console.log(`connect fail, trying again more ${attempts} times`);
			return connect();
		}

		throw e;
	}
}
