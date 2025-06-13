from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ========= App Info ===========
    app_name: str
    version: str = "1.0.0"
    api_prefix: str = "/api/v1"

    # ======== JWT Settings ========
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60

    # ============ URLs ============
    database_url: str
    rabbitmq_url: str

    # =========== API keys =========
    open_ai: str

    # =========== AWS ==============
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_region: str
    s3_bucket_name: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
