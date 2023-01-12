# Devanddevlier

### Prerequisites

-   Install [Node.js](https://nodejs.org/en/download/)
-   Install [Docker](https://docs.docker.com/install/)
-   Install [Docker Compose](https://docs.docker.com/compose/install/)
-   Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
-   .env

    ```
    DATABASE_URL=
    PORT=
    DB_NAME=
    DB_USER=
    DB_PASSWORD=

    TOKEN_SECRET=
    ACCESS_TOKEN_EXPIRATION=
    REFRESH_TOKEN_EXPIRATION=

    REDIS_URL=
    EXPIRE_TIME=
    ```

### Installing

-   Clone the repository
-   Install dependencies
    ```
    yarn install
    ```
-   Run `docker-compose --env-file .env up --build`

### Docs API

Avaiable on /api-docs
