FROM node:18-alpine AS builder
RUN npm --global install pnpm
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.23.1 AS server
COPY --from=builder ./app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
