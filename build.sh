#!/bin/bash
docker build --pull --rm -f "DOCKERFILE" -t "fvlrapi:latest" "."

docker tag fvlrapi:latest ghcr.io/techeron/fvlrapi:latest
docker push ghcr.io/techeron/fvlrapi:latest

docker pull ghcr.io/techeron/fvlrapi:latest