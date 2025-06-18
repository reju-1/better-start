from enum import Enum


class MemberRole(str, Enum):
    ADMIN = "Admin"
    MEMBER = "Member"


class Status(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    PENDING = "Pending"
