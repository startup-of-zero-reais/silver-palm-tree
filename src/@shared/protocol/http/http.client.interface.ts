export namespace Http {
	export interface Client {
		get<Model>(path: string): Promise<Response<Model>>;
	}

	export type Response<T> = {
		status: number;
		data: T;
		message: string;
	};
}
