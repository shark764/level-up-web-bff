# Level Up - Web BFF

## Requirements

- Node 15.12.1
- yarn 1.22.10

## Development

Create a `.env` file with the following keys

- DB_CONNECTION_STRING=your db connection string

Start the development server

```bash
yarn dev
```

## Utilities

Format code using [Prettier](https://prettier.io/) and [Eslint](https://eslint.org/)

```bash
yarn prettify
```



# local dev 

this method work creating local docker image and run it via docker-compose.
##### Docker compose

build
```
docker-compose build
```

 
test locally
```
docker-compose up
```

example 
```
Recreating level-up-web-bff_web-bff_1 ... done
Attaching to level-up-web-bff_web-bff_1
web-bff_1  | 
web-bff_1  | Game Controller Server listening on port 4000 .... 
web-bff_1  |    Start date: Thu Apr 29 2021 04:21:01 GMT+0000 (Coordinated Universal Time)
web-bff_1  | 
web-bff_1  | Connected to mongodb database .... 
web-bff_1  |    Database is runnin on port 27017 
web-bff_1  |    Start date: Thu Apr 29 2021 04:21:02 GMT+0000 (Coordinated Universal Time)
web-bff_1  |    String connection: mongodb+srv://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
^CGracefully stopping... (press Ctrl+C again to force)
Stopping level-up-web-bff_web-bff_1   ... done
```
you can cancel the docker-compose via `control+C` on the terminal.