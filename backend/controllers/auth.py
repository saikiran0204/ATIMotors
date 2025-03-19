from fastapi import APIRouter, Request
from services.auth import register_user, authenticate_user
from schemas.user import UserCreateSchema, UserResponseSchema, UserLoginSchema
from fastapi import HTTPException

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
async def register(user: UserCreateSchema):
    return await register_user(user.email, user.password, user.role)

@router.post("/login")
async def login(user: UserLoginSchema):
    return await authenticate_user(user.email, user.password)


@router.get("/user", response_model=UserResponseSchema)
async def get_user_details(request: Request):
    """Fetch the currently logged-in user's details."""
    current_user = request.state.user
    return {
        "email": current_user["email"],
        "role": current_user["role"]
    }
