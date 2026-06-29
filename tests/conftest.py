"""Health One — Test fixtures and configuration."""

import pytest


@pytest.fixture
def platform_settings():
    """Return platform settings for testing (uses defaults)."""
    from health_one.platform.config import get_platform_settings

    get_platform_settings.cache_clear()
    return get_platform_settings()
