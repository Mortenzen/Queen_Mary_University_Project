#!/bin/bash
WORKDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$WORKDIR"/..
export UID
export GID=$(id -g)
export COMPOSE_PROJECT_NAME=qmul

cd QMUL_Backend
git pull
cd ..

cd QMUL_Frontend
git pull
cd ..

cd Queen_Mary_University_Project
git pull

docker-compose -f docker-compose-mongo.yml up -d
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d --force-recreate
