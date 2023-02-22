import { Inject, Injectable } from '@nestjs/common';
import { HttpErrorException } from '@/@shared/exception-filter/http-error.exception';
import { HttpClient } from '@/@shared/protocol/http/http.client';
import { Http } from '@/@shared/protocol/http/http.client.interface';

@Injectable()
export class ViaCepRepository {
	constructor(
		@Inject(HttpClient)
		private readonly httpClient: Http.Client,
	) {}

	async findByZip(zip: string) {
		const response = await this.httpClient.get<{ data: any }>(
			`${zip}/json/`,
		);

		if ('erro' in response.data) {
			throw new HttpErrorException('Fail getting location', 404);
		}

		return response;
	}
}
