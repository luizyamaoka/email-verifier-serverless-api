
install: ## Install all dependencies needed to run api
	npm install --save

deploy: ## Deploy application to production
	serverless deploy --stage prod

run-dev: ## Start application in development mode
	serverless offline start --stage dev --port 3000

test: ## Run tests on the application
	npm run codestyle

help: ## Show possible make commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'



.DEFAULT_GOAL := help