from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api.v1.routes_design import router as design_router
from app.db.session import engine
from app.db.base import Base

Base.metadata.create_all(bind=engine)


app = FastAPI(title="AI System Design Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(design_router, prefix="/api/v1")