FROM postgres:latest

# Копируем init.sql и dump.csv в контейнер
COPY init.sql /docker-entrypoint-initdb.d/
COPY dump.csv /docker-entrypoint-initdb.d/