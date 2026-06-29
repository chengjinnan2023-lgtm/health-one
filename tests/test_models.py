"""Unit tests for Platform models — DEV-006/007/008."""

from health_one.platform.models.identity import (
    ActivationStatus,
    DataOwnershipTag,
    HealthIdentity,
)
from health_one.platform.models.profile import HealthProfile
from health_one.platform.models.timeline import EventType, HealthTimeline


class TestHealthIdentity:
    """Model field validation and enum tests."""

    def test_activation_status_enum_values(self):
        assert ActivationStatus.PENDING.value == "pending"
        assert ActivationStatus.ACTIVE.value == "active"
        assert ActivationStatus.ARCHIVED.value == "archived"

    def test_data_ownership_tag_enum_values(self):
        assert DataOwnershipTag.CUSTOMER.value == "customer"
        assert DataOwnershipTag.PLATFORM.value == "platform"

    def test_model_tablename(self):
        assert HealthIdentity.__tablename__ == "health_identity"


class TestHealthProfile:
    """Profile model tests."""

    def test_model_tablename(self):
        assert HealthProfile.__tablename__ == "health_profile"


class TestHealthTimeline:
    """Timeline model tests."""

    def test_model_tablename(self):
        assert HealthTimeline.__tablename__ == "health_timeline"

    def test_event_type_enum_has_required_types(self):
        """Verify all RFC-001 §4.7 required event types exist."""
        required = {
            "identity_created",
            "identity_activated",
            "profile_updated",
            "assessment_created",
            "plan_updated",
            "service_completed",
            "ai_conversation_summarized",
            "asset_uploaded",
        }
        available = {e.value for e in EventType}
        assert required <= available
