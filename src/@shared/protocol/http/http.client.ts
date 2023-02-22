import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Http } from './http.client.interface';

@Injectable()
export class HttpClient implements Http.Client {
	private client: AxiosInstance;

	constructor(private readonly _baseURL: string) {
		this.client = axios.create({ baseURL: _baseURL });
	}

	async get<T = any>(path: string): Promise<Http.Response<T>> {
		try {
			const response = await this.client.get(path);

			return {
				status: response.status,
				message: response.statusText,
				data: response.data,
			};
		} catch (e) {
			if (e instanceof AxiosError) {
				return {
					status: e.response.status ?? e.status ?? 500,
					data:
						e.response.data ??
						e.response.data.message ??
						e.response.data.error,
					message:
						e.response.data.message ??
						e.response.data.error ??
						e.message,
				};
			}

			throw e;
		}
	}
}
