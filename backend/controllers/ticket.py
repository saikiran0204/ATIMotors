from fastapi import APIRouter, Depends, Request, HTTPException
from schemas.ticket import CreateTicketSchema, AddCommentSchema, UpdateTicketSchema
from services.tickets import create_ticket, update_ticket, delete_ticket, add_comment, assign_ticket, change_status
from models.ticket import Ticket

router = APIRouter(prefix="/tickets", tags=["Tickets"])


def get_current_user(request: Request):
    return request.state.user  # Extracted from middleware


@router.get("/")
async def get_tickets(request: Request):
    user = get_current_user(request)
    
    if user["role"] == "customer":
        tickets = Ticket.objects(created_by=user["id"])
    elif user["role"] == "agent":
        tickets = Ticket.objects(assigned_to=user["id"])
    elif user["role"] == "admin":
        tickets = Ticket.objects()
    else:
        raise HTTPException(status_code=403, detail="Unauthorized access")
    
    return [{
        "id": str(ticket.id),
        "title": ticket.title,
        "description": ticket.description,
        "status": ticket.status,
        "created_at": ticket.created_at,
        "assigned_to": ticket.assigned_to.email if ticket.assigned_to else None,
        "comments": ticket.comments
    } for ticket in tickets]
    

@router.post("/create")
async def create_ticket_endpoint(request: Request, ticket_data: CreateTicketSchema):
    user = get_current_user(request)
    if user["role"] != "customer":
        raise HTTPException(status_code=403, detail="Only customers can create tickets")
    return create_ticket(ticket_data.title, ticket_data.description, user["email"])

@router.put("/update/{ticket_id}")
async def update_ticket_endpoint(ticket_id: str, data: UpdateTicketSchema, request: Request):
    user = get_current_user(request)
    ticket = Ticket.objects(id=ticket_id).first()
    if not ticket or ticket.created_by.email != user["email"]:
        raise HTTPException(status_code=403, detail="Only the creator can update the ticket")
    return update_ticket(ticket_id, data)

@router.delete("/delete/{ticket_id}")
async def delete_ticket_endpoint(ticket_id: str, request: Request):
    user = get_current_user(request)
    ticket = Ticket.objects(id=ticket_id).first()
    if not ticket or ticket.created_by.email != user["email"]:
        raise HTTPException(status_code=403, detail="Only the creator can delete the ticket")
    return delete_ticket(ticket_id)

@router.post("/comment/{ticket_id}")
async def add_comment_endpoint(ticket_id: str, request: Request, comment_data: AddCommentSchema):
    user = get_current_user(request)
    return add_comment(ticket_id, comment_data.comment, user["email"])

@router.put("/assign/{ticket_id}")
async def assign_ticket_endpoint(ticket_id: str, data: UpdateTicketSchema, request: Request):
    user = get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can assign tickets")
    return assign_ticket(ticket_id, data.assigned_to)

@router.put("/change-status/{ticket_id}")
async def change_status_endpoint(ticket_id: str, data: UpdateTicketSchema, request: Request):
    user = get_current_user(request)
    ticket = Ticket.objects(id=ticket_id).first()
    if not ticket or (ticket.assigned_to and ticket.assigned_to.email != user["email"]):
        raise HTTPException(status_code=403, detail="Only assigned agents can change status")
    return change_status(ticket_id, data.status, user["email"])