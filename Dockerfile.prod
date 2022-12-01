# https://hub.docker.com/_/node/tags
FROM node:18.10.0-alpine3.15 AS builder
RUN apk --no-cache add git
RUN npm --global install pnpm

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
RUN pnpm install
COPY . .

ENV JQ_VERSION=1.6
RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
RUN cp /tmp/jq-linux64 /usr/bin/jq
RUN chmod +x /usr/bin/jq
RUN jq 'to_entries | map_values({ (.key) : ("$" + .key) }) | reduce .[] as $item ({}; . + $item)' ./src/assets/config.json > ./src/assets/config.tmp.json && mv ./src/assets/config.tmp.json ./src/assets/config.json

RUN rm .env
RUN pnpm build

# https://hub.docker.com/r/nginxinc/nginx-unprivileged/tags
FROM nginxinc/nginx-unprivileged:1.23.2-alpine AS server

COPY --from=builder --chown=nginx:nginx ./app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx ./app/dist /usr/share/nginx/html
EXPOSE 8080
COPY --from=builder --chown=nginx:nginx ./app/start-nginx.sh /tmp/start-nginx.sh
ENTRYPOINT ["sh","/tmp/start-nginx.sh"]