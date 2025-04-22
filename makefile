build:
	npx tsc

start: build
	node dist/index.js