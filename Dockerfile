FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader --no-scripts

FROM node:22-bookworm-slim AS frontend

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

FROM dunglas/frankenphp:php8.3-bookworm

WORKDIR /app

RUN install-php-extensions pdo_pgsql redis pcntl

COPY --from=vendor /app/vendor /app/vendor
COPY --from=frontend /app/node_modules /app/node_modules
COPY --from=frontend /usr/local/bin/node /usr/local/bin/node
COPY --chown=www-data:www-data . .

RUN mkdir -p /config /data storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs \
    && APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= php artisan wayfinder:generate --with-form \
    && APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= node ./node_modules/vite/bin/vite.js build \
    && rm -rf node_modules /usr/local/bin/node \
    && php artisan package:discover --ansi \
    && chown -R www-data:www-data /app /config /data

ENV XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data

USER www-data

EXPOSE 8080

CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8080", "--admin-port=2019", "--workers=auto", "--max-requests=500", "--caddyfile=/app/docker/Caddyfile", "--log-level=info"]
