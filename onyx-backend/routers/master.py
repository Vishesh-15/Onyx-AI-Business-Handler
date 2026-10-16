from fastapi import APIRouter
from db.database import clients_collection, issues_collection

router = APIRouter(prefix="/master", tags=["master"])

@router.get("/stats")
async def get_stats():
    total_clients = await clients_collection.count_documents({})
    open_issues = await issues_collection.count_documents({"status": "open"})
    
    return {
        "totalClients": total_clients,
        "openIssues": open_issues,
        "activeAgents": 0,  # placeholder jab tak agents ready nahi
        "monthlyRevenue": 0  # placeholder
    }

@router.get("/dashboard")
async def get_dashboard():
    clients = await clients_collection.find({}, {"password": 0}).to_list(100)
    issues = await issues_collection.find({"status": "open"}).to_list(20)
    
    for c in clients:
        c["_id"] = str(c["_id"])
    for i in issues:
        i["_id"] = str(i["_id"])
    
    return {
        "clients": clients,
        "recentIssues": issues
    }