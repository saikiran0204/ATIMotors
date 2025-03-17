# Support Ticketing System

## Overview
This is a **Full-Stack Support Ticketing System** built using:
- **Backend:** FastAPI + MongoDB
- **Frontend:** React.js (with Redux for state management)
- **Database:** MongoDB (using MongoEngine ORM)
- **Authentication:** JWT-based authentication
- **Role-Based Access Control (RBAC):** Customers, Agents, Admins

## Features
### **Customers:**
- Create new tickets
- View their own tickets
- Add comments to tickets
- Delete completed tickets

### **Agents:**
- View tickets assigned to them
- Change ticket status (e.g., `In Progress`, `Completed`)
- Add comments to tickets

### **Admins:**
- View all tickets
- Assign tickets to agents

---

## **Backend (FastAPI)**
### **Setup Instructions:**
1. **Clone the Repository:**
   ```sh
   git clone <repo-url>
   cd support-ticketing-backend
   ```
2. **Create a Virtual Environment & Install Dependencies:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Set Up Environment Variables:**
   Create a `.env` file:
   ```sh
   MONGO_URI=mongodb://localhost:27017/support_ticketing
   SECRET_KEY=your_secret_key_here
   ```
4. **Run the FastAPI Server:**
   ```sh
   uvicorn app.main:app --reload
   ```
5. **Test the API:** Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

---

## **Frontend (React.js)**
### **Setup Instructions:**
1. **Navigate to the Frontend Directory:**
   ```sh
   cd support-ticketing-frontend
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Run the React App:**
   ```sh
   npm start
   ```
4. **Open the App in Browser:**
   ```sh
   http://localhost:3000
   ```

---

## **API Endpoints**
### **Auth Routes:**
| Method | Endpoint        | Description |
|--------|---------------|-------------|
| POST   | `/auth/register` | Register new user |
| POST   | `/auth/login`    | Login and get JWT token |
| GET    | `/auth/user`       | Get user details |

### **Ticket Routes:**
| Method | Endpoint              | Role       | Description |
|--------|----------------------|-----------|-------------|
| GET    | `/tickets`            | Customer, Agent | Get tickets (customer: own, agent: assigned) |
| POST   | `/tickets/create`     | Customer  | Create a new ticket |
| DELETE | `/tickets/delete/{id}` | Customer  | Delete completed ticket |
| POST   | `/tickets/comment/{id}` | Customer, Agent | Add comment to ticket |
| PUT    | `/tickets/change-status/{id}` | Agent | Change ticket status |
| PUT    | `/tickets/assign/{id}` | Admin | Assign ticket to an agent |

---

## **Role-Based Access Control (RBAC)**
| Role      | Create Ticket | View Tickets | Add Comments | Change Status | Assign Tickets |
|-----------|--------------|--------------|--------------|--------------|--------------|
| Customer  | ✅           | ✅ (own)      | ✅            | ❌           | ❌           |
| Agent     | ❌           | ✅ (assigned) | ✅            | ✅           | ❌           |
| Admin     | ❌           | ✅ (all)      | ❌            | ❌           | ✅           |

---

## **Project Structure**
### **Backend (`support-ticketing-backend/`)**
```
backend/
│── app/
│   ├── main.py          # FastAPI entry point
│   ├── database.py      # MongoDB connection
│   ├── models/
│   │   ├── user.py      # User model
│   │   ├── ticket.py    # Ticket model
│   ├── controllers/
│   │   ├── auth.py      # Auth routes
│   │   ├── ticket.py    # Ticket routes
│   ├── middleware/
│   │   ├── auth_middleware.py # JWT Middleware
```

### **Frontend (`support-ticketing-frontend/`)**
```
frontend/
│── src/
│   ├── api/
│   │   ├── axiosInstance.js    # Axios setup with JWT
│   ├── components/
│   │   ├── Navbar.js           # Navigation bar
│   │   ├── ProtectedRoute.js   # Route protection
│   ├── pages/
│   │   ├── Login.js            # Login page
│   │   ├── Register.js         # Register page
│   │   ├── Dashboard.js        # Ticket dashboard
│   │   ├── Profile.js          # Profile page
│   ├── store/
│   │   ├── authSlice.js        # Redux store for auth
│   │   ├── ticketSlice.js      # Redux store for tickets
│   ├── App.js
│   ├── index.js
```

---

## **Improvements & Next Steps**
- ✅ Add **Email Notifications** for ticket updates
- ✅ Implement **WebSockets** for real-time ticket updates
- ✅ Enhance **UI with TailwindCSS/Material-UI**

---

## **Contributors**
- **Developer:** Your Name Here 😊

---

## **License**
This project is licensed under the **MIT License**.

