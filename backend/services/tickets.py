from models.user import User
from models.ticket import Ticket, TicketStatus
from fastapi import HTTPException

def create_ticket(title: str, description: str, created_by_email: str):
    user = User.objects(email=created_by_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    ticket = Ticket(title=title, description=description, created_by=user)
    ticket.save()
    return {"message": "Ticket created", "ticket_id": str(ticket.id)}

def update_ticket(ticket_id: str, update_data: dict):
    ticket = Ticket.objects(id=ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    for key, value in update_data.items():
        setattr(ticket, key, value)
    ticket.save()
    return {"message": "Ticket updated"}

def delete_ticket(ticket_id: str):
    ticket = Ticket.objects(id=ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket.delete()
    return {"message": "Ticket deleted"}

def add_comment(ticket_id: str, comment: str, user_email: str):
    ticket = Ticket.objects(id=ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket.comments.append(f"{user_email}: {comment}")
    ticket.save()
    return ticket.comments

def assign_ticket(ticket_id: str, agent_email: str):
    ticket = Ticket.objects(id=ticket_id).first()
    agent = User.objects(email=agent_email).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    if agent.role != "agent":
        raise HTTPException(status_code=403, detail="User is not an agent")
    ticket.assigned_to = agent
    ticket.status = TicketStatus.IN_PROGRESS
    ticket.save()
    return {"message": "Ticket assigned to agent", "ticket_id": str(ticket.id)}

def change_status(ticket_id: str, new_status: str, user_email: str):
    ticket = Ticket.objects(id=ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if new_status not in [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.COMPLETED]:
        raise HTTPException(status_code=400, detail="Invalid status")
    ticket.status = new_status
    ticket.save()
    return {"message": "Ticket status updated"}
