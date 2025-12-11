import os
from functools import lru_cache
from pydantic import BaseSettings, AnyHttpUrl, Field, validator


class Settings(BaseSettings):
    api_title: str = Field("VisionVani API", description="Service display name")
    api_version: str = Field("0.1.0", description="Semantic version")
    environment: str = Field("development", description="Environment name")
    frontend_origin: AnyHttpUrl | None = Field(
        default=None,
        description="Allowed origin for CORS; set to your frontend URL",
    )

    @validator("frontend_origin", pre=True)
    def empty_to_none(cls, v):
        return v or None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings loader so the config is read once per process.
    """
    return Settings()

