import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpErrorException } from './http-error.exception';

@Catch()
export class MainExceptionFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: any, host: ArgumentsHost) {
		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		const httpStatus = this.getStatus(exception);
		const error = this.getError(exception);
		const message = this.getMessage(exception);

		const body = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			message,
			error,
		};

		httpAdapter.reply(ctx.getResponse(), body, httpStatus);
	}

	private getMessage(
		error: HttpException | HttpErrorException,
	): string | string[] {
		if (error instanceof HttpException) {
			const response = error.getResponse();

			if (typeof response === 'string') {
				return response;
			}

			const responseObj: any = response;

			if ('message' in responseObj && responseObj.message) {
				return responseObj.message;
			}
		}

		return;
	}

	private getError(error: HttpException | HttpErrorException): string {
		if (error instanceof HttpException) {
			const response = error.getResponse();

			if (typeof response === 'string') {
				return response;
			}

			const responseObj: any = response;

			if ('error' in responseObj && responseObj.error) {
				return responseObj.error;
			}

			if ('message' in responseObj && responseObj.message) {
				return responseObj.message;
			}
		}

		return error.message;
	}

	private getStatus(error: HttpException | HttpErrorException): HttpStatus {
		return error.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
	}
}
