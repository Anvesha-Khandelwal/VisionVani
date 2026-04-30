from functools import lru_cache
from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_title: str = Field("VisionVani API")
    api_version: str = Field("0.1.0")
    environment: str = Field("development")
    frontend_origin: Optional[str] = Field(default=None)

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
    return Settings()