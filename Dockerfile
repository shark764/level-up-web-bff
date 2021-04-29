FROM node:15.2.1-alpine3.12

COPY . /usr/src/web-bff/
WORKDIR /usr/src/web-bff
RUN ["yarn", "install"]


ARG PORT_ARG=4000
ENV PORT=$PORT_ARG
COPY . /usr/src/web-bff

RUN yarn build 

WORKDIR /usr/src/web-bff/dist

EXPOSE $PORT

CMD [ "node", "app.js" ]