FROM node:lts-jessie

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt install \
    python \
    make \
    g++ \
    && npm install --build-from-source=bcrypt 

COPY . .

EXPOSE 3000
EXPOSE 3001

ENV PORT "3000"
ENV NODE_ENV production

ENTRYPOINT npm run start:prod