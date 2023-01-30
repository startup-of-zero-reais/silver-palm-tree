export type NotificationErrorProps = {
	message: string;
};

export default class Notification {
	private errors: NotificationErrorProps[] = [];

	addError(error: NotificationErrorProps): void {
		this.errors.push(error);
	}

	hasError(): boolean {
		return this.errors.length > 0;
	}

	getErrors(): NotificationErrorProps[] {
		return this.errors;
	}

	messages(): string {
		let message = '';

		this.errors.forEach((error) => {
			message += `${error.message}`;
		});

		return message;
	}
}
