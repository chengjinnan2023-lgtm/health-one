"""Unit tests for Store DB models — DEV-013."""

from health_one.store.models.staff import Staff, StaffRole, StaffStatus
from health_one.store.models.store import OperatingStatus, Store, StoreType


class TestStore:
    def test_model_tablename(self):
        assert Store.__tablename__ == "store"

    def test_operating_status_enum(self):
        assert OperatingStatus.PILOT.value == "pilot"
        assert OperatingStatus.ACTIVE.value == "active"
        assert OperatingStatus.INACTIVE.value == "inactive"

    def test_store_type_enum_chinese(self):
        assert StoreType.DIRECT.value == "直营"
        assert StoreType.COOPERATIVE.value == "合作"
        assert StoreType.FRANCHISE.value == "加盟"


class TestStaff:
    def test_model_tablename(self):
        assert Staff.__tablename__ == "staff"

    def test_staff_role_enum_chinese(self):
        assert StaffRole.MANAGER.value == "店长"
        assert StaffRole.HEALTH_ADVISOR.value == "健康管理师"
        assert StaffRole.SERVICE_STAFF.value == "服务人员"

    def test_staff_status_enum(self):
        assert StaffStatus.ACTIVE.value == "active"
        assert StaffStatus.INACTIVE.value == "inactive"

    def test_hash_password(self):
        hashed = Staff.hash_password("test123")
        assert isinstance(hashed, str)
        assert hashed.startswith("$2")

    def test_verify_password_correct(self):
        hashed = Staff.hash_password("correct")
        staff = Staff(display_name="t", username="t", password_hash=hashed)
        assert staff.verify_password("correct") is True

    def test_verify_password_wrong(self):
        hashed = Staff.hash_password("correct")
        staff = Staff(display_name="t", username="t", password_hash=hashed)
        assert staff.verify_password("wrong") is False
