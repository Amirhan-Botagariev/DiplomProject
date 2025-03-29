# Используем официальный образ Python
FROM python:3.12
# Устанавливаем Poetry
ENV POETRY_VERSION=1.8.2
RUN curl -sSL https://install.python-poetry.org | python3 -

# Добавляем Poetry в PATH
ENV PATH="/root/.local/bin:$PATH"

# Устанавливаем рабочую директорию
WORKDIR /platform/platform_backend

# Копируем файлы с зависимостями
COPY platform_backend/pyproject.toml platform_backend/poetry.lock ./

# Отключаем виртуальное окружение внутри Poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Копируем весь проект в контейнер
COPY . .

# Команда для запуска приложения
CMD ["poetry", "run", "python", "run_main.py"]