from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings
from pydantic.functional_validators import field_validator


class Settings(BaseSettings):
    api_title: str = Field("VisionVani API", description="Service display name")
    api_version: str = Field("0.1.0", description="Semantic version")
    environment: str = Field("development", description="Environment name")

    frontend_origin: AnyHttpUrl | None = Field(
        default=None,
        description="Allowed origin for CORS; set to your frontend URL",
    )

    @field_validator("frontend_origin")
    @classmethod
    def validate_frontend_origin(cls, v):
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    """Cached settings loader."""
    return Settings()
