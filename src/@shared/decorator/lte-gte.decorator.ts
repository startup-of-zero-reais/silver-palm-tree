import {
	ValidationOptions,
	registerDecorator,
	ValidationArguments,
} from 'class-validator';

export function LessThanOrEqual(
	property: string,
	validationOptions?: ValidationOptions,
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'lessThanOrEqual',
			target: object.constructor,
			propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = args.object[relatedPropertyName];
					if (relatedValue) return value <= relatedValue;
					return true;
				},
				defaultMessage({ property, constraints }) {
					return `${property} should be less than or equal ${constraints[0]}`;
				},
			},
		});
	};
}

export function GreatherThanOrEqual(
	property: string,
	validationOptions?: ValidationOptions,
) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'greatherThanOrEqual',
			target: object.constructor,
			propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = args.object[relatedPropertyName];
					if (relatedValue) return value >= relatedValue;
					return true;
				},
				defaultMessage({ property, constraints }) {
					return `${property} should be greather than or equal ${constraints[0]}`;
				},
			},
		});
	};
}
