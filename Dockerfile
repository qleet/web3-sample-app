# https://hub.docker.com/_/node/tags
FROM node:18.10.0-alpine3.15 AS builder
RUN apk --no-cache add git
RUN npm --global install pnpm

WORKDIR /app
COPY . .
RUN rm .env
RUN pnpm install
EXPOSE 8080
CMD ["pnpm", "run", "dev"]