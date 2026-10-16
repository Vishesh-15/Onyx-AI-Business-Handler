from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import clients_collection
import bcrypt
import os
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "onyx-secret")

class LoginRequest(BaseModel):
    uid: str
    password: str

def create_token(uid: str):
    payload = {
        "uid": uid,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@router.post("/login")
async def login(req: LoginRequest):
    client = await clients_collection.find_one({"uid": req.uid})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    if not bcrypt.checkpw(req.password.encode(), client["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid password")
    
    token = create_token(req.uid)
    return {
        "token": token,
        "uid": client["uid"],
        "clientName": client["clientName"],
        "modules": client["modules"],
        "theme": client.get("theme", "#3a9e75")
    }