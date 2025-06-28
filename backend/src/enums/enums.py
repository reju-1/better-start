from enum import Enum


class MemberRole(str, Enum):
    ADMIN = "Admin"
    MEMBER = "Member"


class Status(str, Enum):
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    PENDING = "Pending"


class ApplicationStatus(str, Enum):
    PENDING = "Pending"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"


class PriorityLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class KanbanStatus(str, Enum):
    PENDING = "Pending"
    INPROGRESS = "In-progress"
    COMPLETED = "Completed"
    
    
class SalesStatus(str, Enum):
    PENDING = "Pending"
    PAID = "Paid"
    CANCELLED = "Cancelled"