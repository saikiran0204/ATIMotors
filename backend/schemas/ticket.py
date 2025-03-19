from pydantic import BaseModel
from typing import Optional

class CreateTicketSchema(BaseModel):
    title: str
    description: str

class AddCommentSchema(BaseModel):
    comment: str

class TicketResponseSchema(BaseModel):
    title: str
    description: str
    status: str
    assigned_to: Optional[str] = None


class UpdateTicketSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None  