develop:
	npx webpack serve

install: 
	npm ci

publish:
	npm publish --dry-run

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

.PHONY: test

