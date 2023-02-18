OK_COLOR=\033[32;01m
NO_COLOR=\033[0m
ERROR_COLOR=\033[31;01m
WARN_COLOR=\033[33;01m


usage:
	@echo -e "\t$(OK_COLOR)Make usage commands: $(NO_COLOR)"
	@printf "\tmake start\t- Start the application\n"
	@printf "\tmake stop\t- Stop the application\n"

start:
	@echo -e "$(OK_COLOR)==> Wait, starting application...$(NO_COLOR)"
	@docker-compose up -d
	@sleep 2
	@ts-node -r tsconfig-paths/register ./scripts/seed-candidates.ts --length=3 --reseed
	@ts-node -r tsconfig-paths/register ./scripts/seed-recruiters.ts --length=3 --reseed
	@ts-node -r tsconfig-paths/register ./scripts/seed-jobs.ts --length=100 --reseed
	@docker logs -f vacancies-app -n 30

stop:
	@echo -e "$(OK_COLOR)==> Wait, stopping application...$(NO_COLOR)"
	@docker-compose down
	@echo -e "$(OK_COLOR)==> Done, application stopped...$(NO_COLOR)"

unit_test:
	@echo -e "$(OK_COLOR)==> Trying to run unit tests...$(NO_COLOR)"
	@npm run test
