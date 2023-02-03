import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
// import like commonjs - issue in import esmodule
const cookieParser = require('cookie-parser');

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors({
		origin: ['http://localhost', 'http://localhost:3000'],
		credentials: true,
		allowedHeaders: ['x-timestamp', 'x-hash', 'authorization'],
	});
	app.use(helmet());

	const config = new DocumentBuilder()
		.setTitle('Silver Palm Tree')
		.setDescription('The API to handle a awesome tech job board')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	await app.listen(3000);
}
bootstrap();
