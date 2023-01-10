# Devanddevlier 

### Prerequisites
- Install [Node.js](https://nodejs.org/en/download/)
- Install [Docker](https://docs.docker.com/install/)
- Install [Docker Compose](https://docs.docker.com/compose/install/)
- Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
- .env 
    ```
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dnd?schema=public"
    PORT=3000
    DB_NAME=postgres
    DB_USER=postgres
    DB_PASSWORD=postgres

    TOKEN_SECRET=secr3t
    ACCESS_TOKEN_EXPIRATION=1h
    REFRESH_TOKEN_EXPIRATION=1d
    ```

### Installing
- Clone the repository
- Install dependencies
    ```
    yarn install
    ```
- Run `docker-compose --env-file .env up --build`

