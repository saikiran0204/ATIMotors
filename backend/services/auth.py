from fastapi import HTTPException
from models.user import User, UserRole
from utils.security import hash_password, verify_password, create_access_token
from datetime import timedelta

async def register_user(email: str, password: str, role: str):
    if User.objects(email=email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(email=email, password=hash_password(password), role=role)
    user.save()
    return {"message": "User registered successfully"}

async def authenticate_user(email: str, password: str):
    user = User.objects(email=email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email, "role": user.role}, timedelta(minutes=60))
    return {"access_token": token, "token_type": "bearer"}
