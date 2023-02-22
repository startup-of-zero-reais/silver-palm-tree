type KeyOf<T> = Extract<keyof T, string>;

/** PathsToStringProps will get Type T and read like:
 *
 * ```ts
 * PathsToStringProps<{ name:string; user: { email: string } }>
 * ```
 *
 * Will result into:
 *
 * ```ts
 * ["name"] | ["user", "email"]
 * ```
 */
type PathsToStringProps<T> = T extends
	| string
	| number
	| boolean
	| Date
	| Array<any>
	? []
	: {
			[K in KeyOf<T>]: [K, ...PathsToStringProps<T[K]>];
	  }[KeyOf<T>];

/** Join will work also ['string1', 'string2'].join('.')
 *
 * It receive and Paths Array to Join like:
 * ```ts
 * ['name'] | ['user','email']
 * ```
 *
 * And will result into:
 * ```ts
 * "name" | "user.email"
 * ```
 */
type Join<T extends string[]> = T extends []
	? never
	: T extends [infer F]
	? F
	: T extends [infer F, ...infer R]
	? F extends string
		? `${F}.${Join<Extract<R, string[]>>}`
		: never
	: string;

// @ts-ignore
export type DotKeys<T> = Join<PathsToStringProps<T>> & string;
