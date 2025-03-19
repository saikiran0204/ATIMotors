from pydantic import BaseModel, EmailStr
from models.user import UserRole

class UserCreateSchema(BaseModel):
    email: EmailStr
    password: str
    role: UserRole

class UserResponseSchema(BaseModel):
    email: EmailStr
    role: UserRole


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str