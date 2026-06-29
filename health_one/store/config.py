"""Health One — Store Configuration."""

import os
from functools import lru_cache


class StoreSettings:
    """Store service configuration loaded from environment."""

    # Store DB — each store gets its own SQLite file
    STORE_DB_BASE_PATH: str = os.getenv("STORE_DB_BASE_PATH", "data")
    DEFAULT_STORE_CODE: str = os.getenv("DEFAULT_STORE_CODE", "store-001")

    @property
    def store_db_path(self) -> str:
        """Resolve the SQLite database path for the default store."""
        return os.path.join(
            self.STORE_DB_BASE_PATH,
            self.DEFAULT_STORE_CODE,
            "store.db",
        )


@lru_cache()
def get_store_settings() -> StoreSettings:
    """Return cached store settings singleton."""
    return StoreSettings()
