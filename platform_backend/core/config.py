import os
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, PostgresDsn, SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILENAMES = [
    ".env.common",
    ".env.backend",
    ".env.db",
    ".env.pgadmin",
    ".env.metabase",
    ".env.frontend",
]
ENV_FILES = [BASE_DIR / "sys/env" / name for name in ENV_FILENAMES]

LOG_DEFAULT_FORMAT = (
    "[%(asctime)s.%(msecs)03d] %(module)10s:%(lineno)-3d %(levelname)-7s - %(message)s"
)


class RunConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8000


class GunicornConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 1
    timeout: int = 900


class LoggingConfig(BaseModel):
    log_level: Literal[
        "debug",
        "info",
        "warning",
        "error",
        "critical",
    ] = "info"
    log_format: str = LOG_DEFAULT_FORMAT
    log_dir: str = "tmp/log"
    date_format: str = "%Y-%m-%d %H:%M:%S"
    file_logging: bool = True
    backup_count: int = 365  # Store one year of logs

    @property
    def log_file(self) -> str:
        return os.path.join(self.log_dir, "app.log")

    @property
    def access_log_file(self) -> str:
        return os.path.join(self.log_dir, "access.log")

    @property
    def error_log_file(self) -> str:
        return os.path.join(self.log_dir, "error.log")

    @model_validator(mode="after")
    def validate_logging_settings(self) -> "LoggingConfig":
        if not self.file_logging:
            raise ValueError("File logging must be enabled")
        if self.backup_count < 0:
            raise ValueError("backup_count must be non-negative")
        return self


class ApiV1Prefix(BaseModel):
    prefix: str = "/v1"
    users: str = "/users"
    auth: str = "/auth"
    messages: str = "/messages"
    predict: str = "/predict"
    metabase: str = "/metabase"


class ApiPrefix(BaseModel):
    prefix: str = "/api"
    v1: ApiV1Prefix = ApiV1Prefix()

    @property
    def bearer_token_url(self) -> str:
        """Возвращает путь для token login endpoint: 'api/v1/auth/login'"""
        parts = (self.prefix, self.v1.prefix, self.v1.auth, "/login")
        path = "".join(parts)
        return path.removeprefix("/")


class DatabaseConfig(BaseModel):
    url: PostgresDsn
    echo: bool = False
    echo_pool: bool = False
    pool_size: int = 50
    max_overflow: int = 10

    naming_convention: dict[str, str] = {
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }


class AccessToken(BaseModel):
    reset_password_token_secret: SecretStr
    verification_token_secret: SecretStr
    lifetime_seconds: int = 3600


class PredictionModelConfig(BaseModel):
    model_path: Path = Path("prediction_models/model_v1.pkl")
    cat_cols: list[str] = [
        "Gender",
        "MaritalStatus",
        "EducationField",
        "Department",
        "JobRole",
        "BusinessTravel",
    ]
    num_cols: list[str] = [
        "Age",
        "Education",
        "JobLevel",
        "NumCompaniesWorked",
        "TotalWorkingYears",
        "YearsAtCompany",
        "YearsInCurrentRole",
        "YearsSinceLastPromotion",
        "YearsWithCurrManager",
        "WorkLifeBalance",
        "TrainingTimesLastYear",
        "MonthlyIncome",
        "HourlyRate",
        "PercentSalaryHike",
        "PerformanceRating",
        "JobInvolvement",
        "JobSatisfaction",
        "RelationshipSatisfaction",
        "EnvironmentSatisfaction",
    ]
    prediction_query: str = "SELECT * FROM v_employees_for_attrition;"

    @model_validator(mode="after")
    def check_model_exists(cls, values):
        if not values.model_path.exists():
            raise ValueError(f"Model file not found at {values.model_path}")
        return values


class UserDefaultConfig(BaseModel):
    iin: str = "111111111111"
    password: str = "`_7X7y2S8jzp"
    is_active: bool = True
    is_superuser: bool = True
    is_verified: bool = True


class MetabaseSettings(BaseModel):
    site_url: str
    embedding_secret_key: SecretStr
    db_type: str
    db_dbname: str
    db_port: int
    db_user: str
    db_pass: str
    db_host: str
    anon_tracking_enabled: bool = False
    embed_expiry_minutes: int = 10
    username: str = "admin@admin.com"
    password: SecretStr = "Qwerty123456!"


class ScriptConfig(BaseModel):
    path_to_file: str = "system/load_data_script/data/init.sql"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILES,
        case_sensitive=False,
        env_nested_delimiter="__",
        env_prefix="APP_CONFIG_",
    )
    run: RunConfig = RunConfig()
    gunicorn: GunicornConfig = GunicornConfig()
    logging: LoggingConfig = LoggingConfig()
    api: ApiPrefix = ApiPrefix()
    db: DatabaseConfig
    access_token: AccessToken
    user_default: UserDefaultConfig = UserDefaultConfig()
    prediction_model_config: PredictionModelConfig = PredictionModelConfig()
    metabase: MetabaseSettings
    script_config: ScriptConfig = ScriptConfig()


settings = Settings()
