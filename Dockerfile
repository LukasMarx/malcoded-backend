FROM node:carbon-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install --build-from-source=bcrypt \
    && apk del build-dependencies

COPY . .

EXPOSE 3000

ENV PORT "3000"
ENV NODE_ENV production

ENTRYPOINT npm run start:prod