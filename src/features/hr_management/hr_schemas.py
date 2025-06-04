from pydantic import BaseModel


# Example
class JobPost(BaseModel):
    """How The Job Post looks"""

    pass


class JobApply(BaseModel):
    """What info candidate give in the process of application"""

    pass


class JobApplyResponse(BaseModel):
    """After Application submit what should Be the response"""

    pass
