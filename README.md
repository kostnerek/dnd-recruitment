# SSTV - backend 

### Prerequisites
- Install [Node.js](https://nodejs.org/en/download/)
- Install [Docker](https://docs.docker.com/install/)
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
- .env.dev as in [capyAuth](https://github.com/kostnerek/capyAuth)
- .env 
    ```
    PORT=
    DATABASE_URL= reference: https://www.prisma.io/docs/reference/database-reference/connection-urls
    ```

### Installing
- Clone the repository
- Install dependencies
    ```
    yarn install
    ```
- Run `docker-compose --env-file .env.dev up --build`
- Turn off the docker containers ctrl+c
- Turn only the database container
- Create the database 
- `npx prisma generate`
- `npx prisma migrate dev --name init`
- You are set to go


### Info 
We are using Prisma as ORM. You can find more info about it [here](https://www.prisma.io/docs/).
After chaning anything in the database schema, you need to run `npx prisma generate`

### Creating migrations
- Run only database in docker container
- Change DB_Host in .env to `localhost`
- Run `npx prisma migrate dev --name init`
- Change DB_Host in .env to `db`


### TODO
- [ ] Add tests
- [ ] Add scripts for creating migrations
- [ ] Add scripts for npx prisma generate 
