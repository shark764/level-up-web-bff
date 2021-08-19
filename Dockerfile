FROM node:15.2.1-alpine3.12 as build-stage

RUN mkdir -p /usr/src/web-bff
WORKDIR /usr/src/web-bff
COPY package*.json /usr/src/web-bff/
COPY . /usr/src/web-bff/
RUN ["npm", "install"]

RUN ["npm", "run", "build"]

FROM node:15.2.1-alpine3.12 as run-stage

COPY --from=build-stage /usr/src/web-bff /usr/src/web-bff
WORKDIR /usr/src/web-bff
CMD [ "npm", "start" ]