biome = bunx biome
eslint = bunx eslint
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

PHONY:
