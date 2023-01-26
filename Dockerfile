FROM node:18.13.0-alpine3.16

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]