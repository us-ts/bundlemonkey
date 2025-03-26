biome = bunx biome
eslint = bunx eslint
tsup = bunx tsup
typecheck = bunx tsc --noEmit
vitest = bunx vitest

deps:
	bun install

lint: deps PHONY
	$(biome) check
	$(eslint) .

lint.fix: deps PHONY
	$(biome) check --write
	$(eslint) --fix .

typecheck: deps PHONY
	$(typecheck)

typecheck.watch: deps PHONY
	$(typecheck) --watch

test: deps PHONY
	$(vitest) run

test.watch: deps PHONY
	$(vitest) watch

clear: PHONY
	rm -rf dist

build: deps clear PHONY
	$(tsup)
	chmod a+x dist/bin/index.js

bump.version: PHONY
	bun run bin/bumpVersion.ts

PHONY:
