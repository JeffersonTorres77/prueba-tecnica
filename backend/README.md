Guía paso a paso para instalar y correr el backend

Requisitos mínimos
- PHP 8.0+ y extensiones comunes (pdo, mbstring, openssl, tokenizer, xml, ctype, json)
- Composer
- MySQL / MariaDB o PostgreSQL (configurable en .env)

1) Entra al directorio backend
cd proyecto/backend

2) Instala dependencias PHP
composer install

3) Copia el archivo de entorno y ajusta variables
cp .env.example .env

Edita `.env` y configura al menos las variables de conexión a la base de datos:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tu_base_de_datos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_pass

4) Genera la APP_KEY
php artisan key:generate

5) Ejecuta migraciones y seeders
php artisan migrate
php artisan db:seed

6) Inicia el servidor de desarrollo de Laravel
php artisan serve
o tambien
php artisan serve --host=0.0.0.0 --port=8000
