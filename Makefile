# Synkope Website Makefile
# Development tooling for the Synkope consulting website

# Variables
PORT = 8000
NODE_MODULES = node_modules
PACKAGE_JSON = package.json

# Default target
.DEFAULT_GOAL := help

# Phony targets (targets that don't create files)
.PHONY: help install lint lint-fix serve clean dev test

# Help target - displays available commands
help:
	@echo "Synkope Website Development Commands:"
	@echo ""
	@echo "  make install    - Install development dependencies"
	@echo "  make lint       - Run ESLint on JavaScript files"
	@echo "  make lint-fix   - Run ESLint and automatically fix issues"
	@echo "  make serve      - Start local development server on port $(PORT)"
	@echo "  make dev        - Install dependencies and start development server"
	@echo "  make clean      - Remove node_modules and package-lock.json"
	@echo "  make test       - Run linting (alias for lint)"
	@echo "  make help       - Show this help message"
	@echo ""

# Install development dependencies
install:
	@echo "Installing development dependencies..."
	npm install

# Lint JavaScript files with ESLint
lint: $(NODE_MODULES)
	@echo "Running ESLint on JavaScript files..."
	npx eslint js/**/*.js

# Lint and automatically fix JavaScript files
lint-fix: $(NODE_MODULES)
	@echo "Running ESLint with automatic fixes on JavaScript files..."
	npx eslint js/**/*.js --fix

# Start local development server
serve:
	@echo "Starting local development server on http://localhost:$(PORT)..."
	@echo "Press Ctrl+C to stop the server"
	@if command -v python3 > /dev/null 2>&1; then \
		python3 -m http.server $(PORT); \
	elif command -v python > /dev/null 2>&1; then \
		python -m http.server $(PORT); \
	elif command -v php > /dev/null 2>&1; then \
		php -S localhost:$(PORT); \
	elif npx serve --version > /dev/null 2>&1; then \
		npx serve . -p $(PORT); \
	else \
		echo "Error: No suitable server found. Please install Python, PHP, or Node.js with 'serve' package."; \
		exit 1; \
	fi

# Development workflow - install and serve
dev: install serve

# Test target (alias for lint)
test: lint

# Clean development files
clean:
	@echo "Cleaning development files..."
	rm -rf $(NODE_MODULES)
	rm -f package-lock.json

# Ensure node_modules exists
$(NODE_MODULES): $(PACKAGE_JSON)
	@echo "Node modules not found. Installing dependencies..."
	npm install
	@touch $(NODE_MODULES)

# Check if project is ready for linting
lint-check:
	@if [ ! -f "js/script.js" ]; then \
		echo "Error: js/script.js not found. Are you in the project root?"; \
		exit 1; \
	fi
	@if [ ! -f ".eslintrc.json" ]; then \
		echo "Warning: .eslintrc.json not found. Using default ESLint configuration."; \
	fi
