import os
from functools import lru_cache
from typing import Optional
from pydantic import AnyHttpUrl, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_title: str = Field("VisionVani API", description="Service display name")
    api_version: str = Field("0.1.0", description="Semantic version")
    environment: str = Field("development", description="Environment name")
    frontend_origin: Optional[str] = Field(
        default=None,
        description="Allowed origin for CORS; set to your frontend URL",
    )

    @field_validator("frontend_origin", mode="before")
    @classmethod
    def empty_to_none(cls, v):
        return v or None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Cached settings loader — reads config once per process."""
    return Settings()