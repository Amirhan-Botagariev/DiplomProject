FROM python:3.12

# Установка Poetry
ENV POETRY_VERSION=1.8.2
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Установка cron и curl
RUN apt-get update && apt-get install -y cron curl

# Рабочая директория
WORKDIR /platform/platform_backend

# Копируем poetry-зависимости
COPY platform_backend/pyproject.toml ./pyproject.toml
COPY platform_backend/poetry.lock ./poetry.lock
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

# Копируем проект
COPY . .

# Копируем крон и стартер
COPY sys/gunicorn/cron_job/update_prediction_cron /etc/cron.d/update_prediction_cron
COPY sys/gunicorn/start.sh /start.sh

# Разрешения
RUN chmod 0644 /etc/cron.d/update_prediction_cron && \
    chmod +x /start.sh

# Запуск
CMD ["/start.sh"]