# Synkope Website Makefile
# Development tooling for the Synkope consulting website

# Variables
PORT = 8000
NODE_MODULES = node_modules
PACKAGE_JSON = package.json

# Default target
.DEFAULT_GOAL := help

# Phony targets (targets that don't create files)
.PHONY: help install lint lint-fix serve clean dev test cleanup optimize minify audit

# Help target - displays available commands
help:
	@echo "Synkope Website Development Commands:"
	@echo ""
	@echo "  make install    - Install development dependencies"
	@echo "  make lint       - Run ESLint on JavaScript files"
	@echo "  make lint-fix   - Run ESLint and automatically fix issues"
	@echo "  make cleanup    - Remove unused functions and clean up code"
	@echo "  make optimize   - Optimize images and minify assets"
	@echo "  make minify     - Minify CSS and JavaScript files"
	@echo "  make audit      - Run performance audit with Lighthouse"
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

# Clean up unused functions and commented code
cleanup:
	@echo "Cleaning up unused functions and commented code..."
	@echo "Removing unused typeWriter function..."
	@sed -i.bak '/^\/\/ Typing effect for hero title/,/^\/\/ Initialize typing effect.*DISABLED$$/d' js/script.js
	@sed -i.bak '/^\/\/ document\.addEventListener.*DOMContentLoaded.*=>/,/^\/\/ });$$/d' js/script.js
	@echo "Removing unused filterPortfolio function..."
	@sed -i.bak '/^\/\/ Portfolio filter functionality/,/^}$$/d' js/script.js
	@echo "Removing backup files..."
	@rm -f js/script.js.bak
	@echo "Code cleanup completed. Run 'make lint' to verify."

# Optimize images and minify assets
optimize: minify
	@echo "Optimizing images..."
	@if command -v imageoptim > /dev/null 2>&1; then \
		find images/ -name "*.jpg" -o -name "*.png" -o -name "*.gif" | xargs imageoptim; \
	elif command -v optipng > /dev/null 2>&1 && command -v jpegoptim > /dev/null 2>&1; then \
		find images/ -name "*.png" -exec optipng -o2 {} \; ; \
		find images/ -name "*.jpg" -exec jpegoptim --max=85 {} \; ; \
	else \
		echo "No image optimization tool found. Install imageoptim, optipng, or jpegoptim."; \
	fi

# Minify CSS and JavaScript files
minify:
	@echo "Minifying CSS and JavaScript files..."
	@if [ ! -d "dist" ]; then mkdir -p dist/css dist/js; fi
	@if command -v cleancss > /dev/null 2>&1; then \
		cleancss -o dist/css/style.min.css css/style.css; \
		echo "CSS minified to dist/css/style.min.css"; \
	else \
		echo "clean-css not found. Run: npm install -g clean-css-cli"; \
	fi
	@if command -v uglifyjs > /dev/null 2>&1; then \
		uglifyjs js/script.js -o dist/js/script.min.js -c -m; \
		echo "JavaScript minified to dist/js/script.min.js"; \
	else \
		echo "uglify-js not found. Run: npm install -g uglify-js"; \
	fi

# Audit performance with Lighthouse
audit:
	@echo "Running Lighthouse performance audit..."
	@if command -v lighthouse > /dev/null 2>&1; then \
		lighthouse http://localhost:$(PORT) --only-categories=performance --output=html --output-path=./lighthouse-report.html; \
		echo "Lighthouse report saved to lighthouse-report.html"; \
	else \
		echo "Lighthouse not found. Run: npm install -g lighthouse"; \
	fi

# Start local development server
serve:
	@echo "Starting local development server on http://localhost:$(PORT)..."
	@echo "Press Ctrl+C to stop the server"
	@if command -v python3 > /dev/null 2>&1; then \
		python3 -m http.server $(PORT); \
	elif command -v python > /dev/null 2>&1; then \
		python -m http.server $(PORT); \
	elif npx serve --version > /dev/null 2>&1; then \
		npx serve . -p $(PORT); \
	else \
		echo "Error: No suitable server found. Please install Python or Node.js with 'serve' package."; \
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
