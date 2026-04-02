FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libldap2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    # Сначала конфигурируем LDAP (указываем путь к библиотекам)
    && docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu/ \
    # Теперь устанавливаем все расширения, включая ldap
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip ldap \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Установка зависимостей PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Сборка фронтенда (если нужно внутри бэкенда)
RUN npm install && npm run build

# Права доступа
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]