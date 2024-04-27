FROM python:3.9.5-buster
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /opt/app
COPY ./requirements.txt /opt/app/requirements.txt
RUN apt-get update && apt-get install -y libpq-dev gcc postgresql-client && \
    pip install psycopg2==2.8.3 && \
    pip install --upgrade pip && \
    pip install -r requirements.txt
