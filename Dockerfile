FROM node:18.13.0-alpine3.16

COPY . .

RUN npm install --legacy-peer-deps

USER node

EXPOSE 3000

WORKDIR /home/node/app

CMD ["npm","run", "start:dev"]
