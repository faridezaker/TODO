# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 web application with a Blade/Vite frontend. The project uses:
- **Backend**: Laravel 12 framework with PHP 8.2+ (standard structure: Controllers, Models, Service Providers)
- **Frontend**: Blade templates with vanilla JavaScript (ES modules via Vite), Axios for HTTP
- **Styling**: TailwindCSS v4
- **Testing**: PHPUnit for unit and feature tests
- **Database**: SQLite for development (configurable via environment)

## Development Commands

### Setup
```bash
composer run setup   # One-command full setup (install deps, .env, key, migrate, build)
```

Or step-by-step:
```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
npm install && npm run build
```

### Local Development
```bash
npm run dev          # Start Vite dev server with hot reload
php artisan serve    # Start Laravel dev server (port 8000)
php artisan queue:listen  # Listen to background jobs (in separate terminal)
php artisan pail     # View application logs (in separate terminal)
```

**All-in-one dev**: Use `composer run dev` to start all services concurrently (server, queue, logs, Vite).

### Build for Production
```bash
npm run build        # Compile frontend assets to /public/build
php artisan optimize  # Cache configuration and routes
```

### Testing
```bash
composer run test    # Run full test suite (unit + feature)
php artisan test --filter=TestName  # Run specific test
php artisan test tests/Feature/ExampleTest.php  # Run single file
```

### Code Quality
- **Linting**: `vendor/bin/pint` (Laravel Pint - PHP linter/fixer)
- **Check only**: `vendor/bin/pint --test`
- **Fix issues**: `vendor/bin/pint`

## Architecture Overview

### Backend Structure

**Entry Point**: `bootstrap/app.php` configures the Application instance with:
- Web routing (`routes/web.php`)
- Console commands (`routes/console.php`)
- Health check endpoint (`/up`)
- Middleware pipeline
- Exception handling

**Key Directories**:
- `app/Http/Controllers/` - HTTP request handlers
- `app/Models/` - Eloquent ORM models (User model provided)
- `app/Providers/` - Service providers for application bootstrapping

**Database**:
- Migrations stored in `database/migrations/` (timestamp-based versioning)
- Default migration creates users table, password_reset_tokens, and sessions
- SQLite database at `database/database.sqlite` (not in git)

### Frontend Structure

**Build System**: Vite + Laravel plugin handles asset compilation
- **CSS**: `resources/css/app.css` imports TailwindCSS v4, sources views from Blade templates
- **JS**: `resources/js/app.js` is the entry point (currently imports bootstrap only)
- **Bootstrap**: `resources/js/bootstrap.js` initializes Axios and global variables
- **Output**: Built assets go to `public/build/` with manifest.json for fingerprinting

**Vite Config** (`vite.config.js`):
- Watches for changes in `resources/**/*.blade.php`, `resources/**/*.js`
- Excludes framework cached views from watch
- Integrates TailwindCSS v4 plugin for JIT compilation

**Styling**:
- TailwindCSS v4 with utility-first approach
- Custom font: Instrument Sans (imported from Bunny Fonts)
- Views and JS are scanned for class usage; only used utilities are included

**Views**:
- `resources/views/welcome.blade.php` - Welcome page with login navigation
- Blade is Laravel's templating engine (PHP-based, supports `{{ }}` for escaping)

### Testing Structure

**Test Configuration** (`phpunit.xml`):
- Test suites: Unit tests (`tests/Unit/`) and Feature tests (`tests/Feature/`)
- Source code coverage tracked for `app/` directory
- Testing database: SQLite in-memory (`:memory:`)
- Test environment variables configured (APP_ENV=testing, CACHE_STORE=array, etc.)

**Base Test Class** (`tests/TestCase.php`):
- Extends Laravel's TestCase for database testing
- Provides helpers like `$this->get()`, `$this->post()` for HTTP testing

### Configuration

Key config files in `config/`:
- `app.php` - Application name, debug mode, locale
- `database.php` - Database connections (SQLite default)
- `auth.php` - Authentication providers and password reset
- `cache.php`, `session.php`, `queue.php` - Caching, sessions, job queues
- `mail.php`, `services.php`, `filesystems.php` - External service configuration

Environment variables (`.env`):
- `APP_DEBUG=true` (development only)
- `APP_ENV=local`, `APP_URL=http://localhost`
- `DB_CONNECTION=sqlite` (default)
- `QUEUE_CONNECTION=database` (uses database for job queue)
- `CACHE_STORE=database`, `SESSION_DRIVER=database` - Uses DB for caching/sessions

## Development Notes

### Routing
- Web routes defined in `routes/web.php` - returns Blade views
- Currently has single route: `GET /` renders `welcome` view
- Routes use Laravel's Route facade with fluent API

### Database & Migrations
- Migrations use Laravel's Schema builder (database-agnostic)
- Run pending migrations with `php artisan migrate`
- Rollback with `php artisan migrate:rollback`
- Fresh database for testing (configured in `phpunit.xml`)

### Hot Reload in Development
- Vite dev server watches `resources/css/`, `resources/js/`, `resources/views/`
- Changes to Blade files trigger full page reload (no HMR for Blade)
- Changes to JS/CSS update via HMR when possible
- URL is injected via `@vite()` Blade directive in base layout

### Queue Jobs & Async Tasks
- Queue connection is database-based
- Listen to jobs with `php artisan queue:listen`
- Testing uses `QUEUE_CONNECTION=sync` (jobs run immediately)

### Environment Setup
- Copy `.env.example` to `.env` during setup
- Run migrations and key generation before development
- SQLite database is auto-created; no external database required for local dev

## Key Files at a Glance

| File/Directory | Purpose |
|---|---|
| `bootstrap/app.php` | Application bootstrap & routing configuration |
| `app/Models/User.php` | Eloquent User model with authentication |
| `routes/web.php` | HTTP route definitions |
| `resources/css/app.css` | Application styles (TailwindCSS) |
| `resources/js/app.js` | JavaScript entry point |
| `resources/views/` | Blade template files |
| `config/app.php` | Core application configuration |
| `database/migrations/` | Database schema definitions |
| `tests/` | Unit and feature tests |
| `vite.config.js` | Vite bundler configuration |
| `.env.example` | Environment variable template |
