# Sistema de Controle de Estoque

Esta aplicação Laravel oferece um sistema de controle de estoque para gerenciar inventário de forma eficiente.

## Pré-requisitos

- PHP >= 8.1
- Composer
- MySQL ou PostgreSQL
- Node.js e npm

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/yourusername/stock-control-laravel.git
    cd stock-control-laravel
    ```

2. Instale as dependências PHP:
    ```bash
    composer install
    ```

3. Instale e compile os assets do frontend:
    ```bash
    npm install
    npm run dev
    ```

4. Configure as variáveis de ambiente:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. Configure a conexão do banco de dados no arquivo `.env`:
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=stock_control
    DB_USERNAME=root
    DB_PASSWORD=
    ```

6. Execute as migrações e seeders do banco de dados:
    ```bash
    php artisan migrate --seed
    ```

## Executando a Aplicação

1. Inicie o servidor de desenvolvimento:
    ```bash
    php artisan serve
    ```

2. Acesse a aplicação em http://localhost:8000

## Testes

```bash
php artisan test
```

É possível rodar a aplicação também utilizando o Laravel Sail