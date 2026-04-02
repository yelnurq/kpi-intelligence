#!/bin/bash
set -e

# Ensure storage directory structure exists
mkdir -p /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/framework/cache/data \
         /var/www/storage/logs \
         /var/www/bootstrap/cache
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Generate APP_KEY if not set
if [ -z "$APP_KEY" ]; then
  export APP_KEY=$(php artisan key:generate --show --no-ansi)
fi

# Write a minimal .env so artisan commands work
cat > /var/www/.env <<EOF
APP_NAME="${APP_NAME:-KPI-Intelligence}"
APP_ENV="${APP_ENV:-production}"
APP_KEY=${APP_KEY}
APP_DEBUG="${APP_DEBUG:-false}"
APP_URL="${APP_URL:-http://localhost:8000}"

DB_CONNECTION=${DB_CONNECTION:-mysql}
DB_HOST=${DB_HOST:-mysql}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-kpi_db}
DB_USERNAME=${DB_USERNAME:-kpi_user}
DB_PASSWORD=${DB_PASSWORD:-kpi_password}

SESSION_DRIVER=${SESSION_DRIVER:-file}
CACHE_STORE=${CACHE_STORE:-file}
QUEUE_CONNECTION=${QUEUE_CONNECTION:-sync}
FILESYSTEM_DISK=${FILESYSTEM_DISK:-local}
EOF

# Wait for MySQL and run migrations
until php artisan migrate --force 2>/dev/null; do
  echo "Waiting for database connection..."
  sleep 3
done

# Seed database (skip if already seeded)
php artisan db:seed --force 2>/dev/null || true

# Clear stale cache files and regenerate
rm -f /var/www/bootstrap/cache/config.php /var/www/bootstrap/cache/routes*.php
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Laravel server
exec php artisan serve --host=0.0.0.0 --port=8000
