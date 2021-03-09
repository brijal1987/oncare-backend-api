# dockerize-image

## Clone Repo
`git clone https://github.com/brijal1987/oncare-backend-api.git`

# Building by docker compose

## Start Server - Building docker image
`docker-compose up -d --build`

## Check API running on
`http://localhost:8000/`

## Stop Server
`docker-compose stop`


# Building by docker

## Build Docker image
`docker build -t doc_container_2 .`

## Check your created images
`docker images`

## Run build image
`docker run -dp 8000:8000 -d doc_container_2`

## Check API running on
`http://localhost:8000/`

## Check your running container
`docker ps`

## Stop running docker container
`docker stop my_container`


# Database Setup
## Run Migrations
`npm run migrate`

## Run seed
`npm run seed`

## Rollback Migrations
`npm run migrate:undo`

