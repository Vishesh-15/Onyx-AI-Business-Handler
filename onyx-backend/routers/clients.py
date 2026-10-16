from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import clients_collection
import bcrypt
from datetime import datetime

router = APIRouter(prefix="/clients", tags=["clients"])

class CreateClientRequest(BaseModel):
    uid: str
    clientName: str
    clientType: str
    password: str
    modules: list[str]

@router.post("/create")
async def create_client(req: CreateClientRequest):
    existing = await clients_collection.find_one({"uid": req.uid})
    if existing:
        raise HTTPException(status_code=400, detail="UID already exists")
    
    hashed = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
    
    client_doc = {
        "uid": req.uid,
        "clientName": req.clientName,
        "clientType": req.clientType,
        "password": hashed,
        "modules": req.modules,
        "theme": "#3a9e75",
        "createdAt": datetime.utcnow().isoformat(),
        "status": "active"
    }
    
    await clients_collection.insert_one(client_doc)
    return {"message": "Client created", "uid": req.uid}

@router.get("/all")
async def get_all_clients():
    clients = await clients_collection.find({}, {"password": 0}).to_list(100)
    for c in clients:
        c["_id"] = str(c["_id"])
    return clients