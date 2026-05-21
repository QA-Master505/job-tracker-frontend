dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

install:
	npm install

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

clean:
	npm run clean

help:
	@echo "Available commands:"
	@echo "  make dev        - Start development server (npm run dev)"
	@echo "  make build      - Build for production (npm run build)"
	@echo "  make preview    - Preview production build (npm run preview)"
	@echo "  make install    - Install dependencies (npm install)"
	@echo "  make lint       - Run ESLint (npm run lint)"
	@echo "  make lint-fix   - Fix ESLint errors (npm run lint:fix)"
	@echo "  make format     - Format code with Prettier (npm run format)"
	@echo "  make clean      - Clean build cache (npm run clean)"
