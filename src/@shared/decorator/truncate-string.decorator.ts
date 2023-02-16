import { Transform, TransformFnParams } from 'class-transformer';

/**
 * TruncateAfter is a decorator who will transform received value.
 *
 * The transformation is about truncate the string length. If the received
 * string has more than length defined will be truncate the string.
 *
 * In case of the string length less than or equal defined `length - 3`
 * the `...` will not be appended. Else the `...` will be append at end of
 * the string
 *
 * Examples:
 *
 * `@TruncateAfter(180)`
 *
 * 	"text with +180 chars"	-> "text with ..."
 * 	"text with 177 chars"	-> "text with 177 chars"
 * 	"text with -177 chars"	-> "text with -177 chars"
 *
 * @param length - The max size of the string to be truncated
 * @default length = 180
 * @returns {PropertyDecorator}
 */
export function TruncateAfter(length = 180): PropertyDecorator {
	return Transform(function (params: TransformFnParams) {
		if (params.value) {
			const value: string = params.value;

			const trucatedValue = value.substring(0, length);
			if (value.length >= length - 3) return trucatedValue + '...';
			return trucatedValue;
		}

		return params;
	});
}
