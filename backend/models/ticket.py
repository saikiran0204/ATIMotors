import mongoengine as me
from datetime import datetime
from models.user import User
from fastapi import HTTPException

class TicketStatus:
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Ticket(me.Document):
    title = me.StringField(required=True)
    description = me.StringField(required=True)
    status = me.StringField(choices=[TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.COMPLETED], default=TicketStatus.OPEN)
    created_by = me.ReferenceField(User, required=True)
    assigned_to = me.ReferenceField(User, null=True)
    comments = me.ListField(me.StringField(), default=[])
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)

    meta = {"collection": "tickets", "db_alias": "app"}

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)