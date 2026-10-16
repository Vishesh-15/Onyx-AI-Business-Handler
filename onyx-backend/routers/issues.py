from fastapi import APIRouter
from pydantic import BaseModel
from db.database import issues_collection
from datetime import datetime

router = APIRouter(prefix="/issues", tags=["issues"])

class IssueRequest(BaseModel):
    uid: str
    clientName: str
    page: str
    category: str
    title: str
    description: str

@router.post("/report")
async def report_issue(req: IssueRequest):
    issue_doc = {
        "uid": req.uid,
        "clientName": req.clientName,
        "page": req.page,
        "category": req.category,
        "title": req.title,
        "description": req.description,
        "status": "open",
        "createdAt": datetime.utcnow().isoformat(),
    }
    await issues_collection.insert_one(issue_doc)
    return {"message": "Issue reported"}

@router.get("/all")
async def get_all_issues():
    issues = await issues_collection.find({}).to_list(100)
    for i in issues:
        i["_id"] = str(i["_id"])
    return issues

@router.patch("/{issue_id}/resolve")
async def resolve_issue(issue_id: str):
    from bson import ObjectId
    await issues_collection.update_one(
        {"_id": ObjectId(issue_id)},
        {"$set": {"status": "resolved"}}
    )
    return {"message": "Issue resolved"}