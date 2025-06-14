from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ========== API Keys ==========
    openai_api_key: str

    # =========== URLs =============
    rabbitmq_url: str
    result_post_url: str

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
