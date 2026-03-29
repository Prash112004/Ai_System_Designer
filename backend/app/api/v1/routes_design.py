from fastapi import APIRouter, HTTPException
from app.services.design_service import generate_design
from app.db.session import SessionLocal
from app.models.design_model import Design


router = APIRouter()

@router.post("/designs/generate")
def create_design(payload: dict):
    try:
        prompt = payload.get("prompt")

        if not prompt:
            raise HTTPException(status_code=400, detail="Prompt is required")

        result = generate_design(prompt)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Get ALL designs
@router.get("/designs")
def get_designs():
    db = SessionLocal()
    try:
        return db.query(Design).all()
    finally:
        db.close()


#  Get ONE design
@router.get("/designs/{design_id}")
def get_design(design_id: str):
    db = SessionLocal()
    try:
        design = db.query(Design).filter(Design.id == design_id).first()

        if not design:
            raise HTTPException(status_code=404, detail="Not found")

        return design
    finally:
        db.close()