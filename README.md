# DevPulse

A Laravel 11 web application.

## Prerequisites

- [Laravel Herd](https://herd.laravel.com/) (Recommended for Windows/macOS) or PHP >= 8.2
- Composer
- Node.js & NPM

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamyeaung/yeaung.git
   cd yeaung/backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment Setup**
   Copy the example `.env` file and generate an application key:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup**
   This project uses SQLite by default. Run the database migrations to automatically create the database and required tables (including the `sessions` table):
   ```bash
   php artisan migrate
   ```

5. **Serve the Application**
   If you are using **Laravel Herd**, simply link the directory:
   ```bash
   herd link yeaung
   ```
   Then visit `http://yeaung.test` or `http://backend.test` in your browser.

   Alternatively, use PHP's built-in server:
   ```bash
   php artisan serve
   ```
