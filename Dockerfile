# https://hub.docker.com/_/node/tags
FROM node:18.10.0-alpine AS builder
RUN npm --global install pnpm
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
RUN pnpm install
COPY .npmrc ./
COPY . .
RUN pnpm build

# https://hub.docker.com/r/nginxinc/nginx-unprivileged/tags
FROM nginxinc/nginx-unprivileged:1.23.1 AS server
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
