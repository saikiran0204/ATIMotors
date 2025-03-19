import mongoengine as me
from datetime import datetime
from enum import Enum

class UserRole(Enum):
    CUSTOMER = "customer"
    AGENT = "agent"
    ADMIN = "admin"


class User(me.Document):
    meta = {
        'collection': 'users',
        'db_alias': 'app',
        'strict': False,
    }

    email = me.StringField(required=True, unique=True)
    password = me.StringField(required=True)
    role = me.StringField(choices=[role.value for role in UserRole], required=True)
    created_at = me.DateTimeField(default=datetime.utcnow)
    updated_at = me.DateTimeField(default=datetime.utcnow)


    def save(self, *args, **kwargs):
        self.role = self.role.value
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)
