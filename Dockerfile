# https://hub.docker.com/_/node/tags
FROM node:18.12.1-alpine AS builder
RUN apk --no-cache add git
RUN npm --global install npm@latest
RUN npm --global install pnpm

WORKDIR /app
COPY . .
RUN rm .env
RUN pnpm install
EXPOSE 8080
CMD ["pnpm", "run", "dev"]