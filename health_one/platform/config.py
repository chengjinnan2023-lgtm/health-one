"""Health One — Platform Configuration."""

import os
from functools import lru_cache


class PlatformSettings:
    """Platform service configuration loaded from environment."""

    # Database
    PLATFORM_DB_URL: str = os.getenv(
        "PLATFORM_DB_URL",
        "postgresql+asyncpg://health_one:changeme@localhost:5432/health_one_platform",
    )

    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "changeme-change-me-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_HOURS: int = int(os.getenv("JWT_EXPIRE_HOURS", "8"))

    # Store DB Path
    STORE_DB_BASE_PATH: str = os.getenv("STORE_DB_BASE_PATH", "data")

    # App
    APP_NAME: str = "Health One Platform API"
    APP_VERSION: str = "0.2.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"


@lru_cache()
def get_platform_settings() -> PlatformSettings:
    """Return cached platform settings singleton."""
    return PlatformSettings()
