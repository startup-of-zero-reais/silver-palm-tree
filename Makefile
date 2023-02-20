OK_COLOR=\033[32;01m
NO_COLOR=\033[0m
ERROR_COLOR=\033[31;01m
WARN_COLOR=\033[33;01m

NVM=which nvm

usage:
	@echo -e "\t$(OK_COLOR)Make usage commands: $(NO_COLOR)"
	@printf "\tmake start\t- Start the application\n"
	@printf "\tmake stop\t- Stop the application\n"

start:
	@echo -e "$(OK_COLOR)==> Wait, starting application...$(NO_COLOR)"
	@docker-compose up -d
	@./scripts/prepare-seed
	@docker logs -f vacancies-app -n 30

stop:
	@echo -e "$(OK_COLOR)==> Wait, stopping application...$(NO_COLOR)"
	@docker-compose down
	@echo -e "$(OK_COLOR)==> Done, application stopped...$(NO_COLOR)"

unit_test:
	@echo -e "$(OK_COLOR)==> Trying to run unit tests...$(NO_COLOR)"
	@npm run test
