FROM node:15.2.1-alpine3.12

COPY . /usr/src/web-bff/
WORKDIR /usr/src/web-bff
RUN ["yarn", "install"]


COPY . /usr/src/web-bff

RUN yarn build 

WORKDIR /usr/src/web-bff/dist


CMD [ "node", "app.js" ]