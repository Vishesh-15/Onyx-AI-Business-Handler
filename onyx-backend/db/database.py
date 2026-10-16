from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

client = AsyncIOMotorClient(MONGODB_URL)
db = client["onyx"]

# Collections
clients_collection = db["clients"]
issues_collection = db["issues"]
logs_collection = db["logs"]