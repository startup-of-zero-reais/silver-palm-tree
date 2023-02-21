import { faker } from '@faker-js/faker';
import { ObjectTransformer } from './object-transformer';

describe('Helpers > Object Transformer', () => {
	it('should transform a object or a class to another object', () => {
		const fakeObj = {
			_name: faker.name.firstName(),
			_company: {
				_id: undefined,
				name: faker.company.name(),
			},
			_email: faker.internet.email(),
		};

		const expected = {
			name: fakeObj._name,
			companyID: undefined,
			companyName: fakeObj._company.name,
			user: { email: fakeObj._email },
		};

		const transformer = ObjectTransformer.transform<
			typeof fakeObj,
			typeof expected
		>(fakeObj);

		transformer.property('_name').to('name');
		transformer.property('_company._id').to('companyID');
		transformer.property('_company.name').to('companyName');
		transformer.property('_email').to('user.email');
		// @ts-ignore
		transformer.property('unknown').to('still_unknown');

		expect(transformer.transformed()).toEqual(expected);

		expect(transformer.transformed()).not.toHaveProperty('companyID');
		expect(transformer.transformed()).not.toHaveProperty('unknown');
		expect(transformer.transformed()).not.toHaveProperty('still_unknown');
	});
});
