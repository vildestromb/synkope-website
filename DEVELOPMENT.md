# Development Guide

This document outlines the development workflow and tools for the Synkope website project.

## Quick Start

```bash
# Install development dependencies
make install

# Start development server
make serve

# Run code linting
make lint

# Auto-fix linting issues
make lint-fix
```

## Available Commands

The project includes a Makefile with the following targets:

| Command | Description |
|---------|-------------|
| `make help` | Display all available commands |
| `make install` | Install development dependencies (ESLint, serve) |
| `make lint` | Run ESLint on all JavaScript files |
| `make lint-fix` | Run ESLint and automatically fix issues |
| `make serve` | Start local development server on port 8000 |
| `make dev` | Install dependencies and start development server |
| `make test` | Alias for `make lint` |
| `make clean` | Remove node_modules and package-lock.json |

## Development Dependencies

The project uses the following development tools:

### ESLint
- **Version**: 8.57.0
- **Purpose**: Code linting and style enforcement
- **Config**: `.eslintrc.json`
- **Files linted**: `js/**/*.js`

### Serve Package
- **Version**: 14.2.1
- **Purpose**: Alternative local development server
- **Usage**: Fallback when Python/PHP not available

## Local Development Server

The `make serve` command automatically detects and uses the best available server:

1. **Python 3** (`python3 -m http.server`)
2. **Python 2** (`python -m http.server`)
3. **PHP** (`php -S localhost:8000`)
4. **Node.js serve** (`npx serve`)

The server runs on `http://localhost:8000` by default.

## Code Style and Linting

### ESLint Configuration

The project follows these coding standards:

- **Indentation**: 2 spaces
- **Quotes**: Double quotes preferred (single quotes allowed for avoiding escapes)
- **Semicolons**: Required
- **Line endings**: Unix (LF)
- **Max line length**: 120 characters
- **Trailing commas**: Not allowed
- **Function parentheses**: No space before for named/anonymous functions

### Running Lints

```bash
# Check for linting issues
make lint

# Automatically fix fixable issues
make lint-fix
```

### Common Linting Issues

- **Trailing commas**: Remove commas at the end of object/array literals
- **Function spacing**: Remove spaces before parentheses in function declarations
- **Indentation**: Use 2 spaces consistently
- **Quotes**: Prefer double quotes, use single quotes to avoid escaping

## File Structure

```
synkope-website/
├── Makefile              # Development commands
├── package.json          # Node.js dependencies and scripts
├── package-lock.json     # Dependency lockfile
├── .eslintrc.json       # ESLint configuration
├── index.html           # Main website file
├── css/
│   └── style.css        # Stylesheets
├── js/
│   └── script.js        # JavaScript (linted by ESLint)
├── images/              # Website assets
└── tjenester/           # Service pages
```

## Development Workflow

### Setting up for the first time

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vildestromb/synkope-website.git
   cd synkope-website
   ```

2. **Install dependencies**:
   ```bash
   make install
   ```

3. **Start development server**:
   ```bash
   make serve
   ```

4. **Open browser** to `http://localhost:8000`

### Daily development

1. **Start the server**:
   ```bash
   make serve
   ```

2. **Make changes** to HTML, CSS, or JavaScript files

3. **Run linting** before committing:
   ```bash
   make lint
   ```

4. **Fix any issues** automatically where possible:
   ```bash
   make lint-fix
   ```

### Before committing code

Always run linting to ensure code quality:

```bash
make lint
```

If there are fixable issues, run:

```bash
make lint-fix
```

## Troubleshooting

### "Command not found: make"

**macOS**: Install Xcode Command Line Tools:
```bash
xcode-select --install
```

**Linux**: Install build-essential:
```bash
sudo apt-get install build-essential  # Ubuntu/Debian
sudo yum install make                  # CentOS/RHEL
```

**Windows**: Use WSL, Git Bash, or install make via package manager

### "No suitable server found"

Install one of the supported server options:

- **Python**: Usually pre-installed on macOS/Linux
- **PHP**: `brew install php` (macOS) or `sudo apt-get install php` (Linux)  
- **Node.js**: Install from [nodejs.org](https://nodejs.org) and run `make install`

### ESLint errors

1. Run `make lint-fix` to automatically fix common issues
2. Review remaining warnings/errors manually
3. Update `.eslintrc.json` if rules are too strict for the project

### Port 8000 already in use

Change the port in the Makefile:

```makefile
PORT = 3000  # Change from 8000 to desired port
```

## Scripts vs Makefile

The project includes both npm scripts and Makefile targets:

### npm scripts (package.json)
```bash
npm run lint    # Same as make lint
npm run serve   # Same as make serve  
npm run dev     # Same as make serve
```

### Makefile (recommended)
```bash
make lint       # More comprehensive, includes dependency checking
make serve      # Multi-backend server detection
make help       # Built-in help system
```

The Makefile is recommended as it provides better cross-platform compatibility and doesn't require Node.js to be installed for basic development.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run `make lint` to check code style
4. Run `make lint-fix` to auto-fix issues
5. Test your changes with `make serve`
6. Commit your changes
7. Open a pull request

## Production Deployment

This project is designed for static hosting (GitHub Pages). The development tools are not needed in production:

- Only commit source files (HTML, CSS, JS, images)
- The `node_modules/` directory is automatically ignored
- ESLint and development dependencies are not deployed