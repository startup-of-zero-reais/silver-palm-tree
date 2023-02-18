import { registerDecorator, ValidationOptions } from 'class-validator';

export function MaxArrayLength(
	length: number,
	validationOptions?: ValidationOptions,
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'maxArrayLength',
			target: object.constructor,
			propertyName,
			constraints: [length],
			options: validationOptions,
			validator: {
				validate(value: any) {
					if (typeof value !== 'object') return false;
					if (!Array.isArray(value)) return false;

					return value.length <= length;
				},
				defaultMessage({ property }) {
					return `${property} should have max ${length} options`;
				},
			},
		});
	};
}
