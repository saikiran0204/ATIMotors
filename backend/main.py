from fastapi import FastAPI
from controllers.auth import router as auth_router
from controllers.ticket import router as ticket_router
from middleware.auth_middleware import AuthMiddleware
from database import db_client
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Support Ticketing System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (Change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Add authentication middleware
app.add_middleware(AuthMiddleware)

app.include_router(auth_router)
app.include_router(ticket_router)
