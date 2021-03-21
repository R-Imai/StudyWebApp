import datetime
from pydantic import BaseModel

class SimpleUserInfo(BaseModel):
    id: str
    name: str
    icon: str
