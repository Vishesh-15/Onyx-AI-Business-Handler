from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from db.database import client as mongo_client

load_dotenv()

app = FastAPI(title="ONYX Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import auth, clients, issues, master
app.include_router(auth.router)
app.include_router(clients.router)
app.include_router(issues.router)
app.include_router(master.router)

@app.on_event("startup")
async def startup():
    try:
        await mongo_client.admin.command("ping")
        print("✅ MongoDB connected")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

@app.get("/")
async def root():
    return {"status": "ONYX Backend running"}

@app.get("/health")
async def health():
    return {"status": "ok"}