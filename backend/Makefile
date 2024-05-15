all: dev

install:
	$(call RUN, pip3 install -r requirements.txt)

shell:
	$(call RUN, python3 manage.py shell)

create-su: migrate
	$(call RUN, bash -c "python3 manage.py createsuperuser --noinput || true")

migrate: createdb
	$(call RUN, python3 manage.py migrate)

makemigrations:
	$(call RUN, python3 manage.py makemigrations)

dev: install migrate create-su
	$(call RUN, python3 manage.py runserver 0.0.0.0:8000)

.PHONY: all dev install migrate shell createdb resetdb

define RUN
	@printf "\033[34m%s\033[m " "==>"
	$1
endef
