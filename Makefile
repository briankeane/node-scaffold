install:
	cp ./server/.env-example ./server/.env && \
	cp ./client/.env-example ./client/.env && \
	docker-compose build

launch:
	docker-compose up

terminate:
	docker-compose down && \
	docker stop $(docker ps -aq) && \
	docker rm $(docker ps -aq)

test-server:
	docker-compose exec server npm run test

test-server-with-logging:
	docker-compose exec --env LOGGING_LEVEL=verbose server npm run test 

generate-migration:
	docker-compose exec server sequelize migration:generate --name=$(NAME)

db-migrate-all:
	docker-compose exec server npm run migrate:all

db-reset-all:
	docker-compose exec server npm run db:reset && \
	docker-compose exec server npm run db:reset:test

build-tsc:
	docker-compose exec client npm run build-tsc
