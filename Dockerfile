FROM node:8-alpine

RUN apk add --no-cache graphicsmagick

COPY ./package*.json /src/

WORKDIR /src

RUN npm install

COPY index.js /src/index.js

CMD ["node", "index.js"]
