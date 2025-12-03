FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    zlib1g-dev \
    libzip-dev \
    && docker-php-ext-install intl zip pdo pdo_mysql

RUN a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# --- CORRECTION ICI : On crée le dossier Entity au cas où il manque ---
RUN mkdir -p src/Entity

# On s'assure que le fichier console est exécutable
RUN chmod +x bin/console

# On force l'environnement de PROD
ENV APP_ENV=prod
ENV COMPOSER_ALLOW_SUPERUSER=1

# Installation des dépendances
RUN composer install --no-dev --optimize-autoloader

# Permissions
RUN chown -R www-data:www-data /var/www/html/var

# Configuration Apache
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf