from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import os

from app.routes import generate
# from app.routes import auth
# from app.database import Base
# from app.database import engine

# Base.metadata.create_all(bind=engine)



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Frontend Path
# -------------------------------

# from pathlib import Path

# BASE_DIR = Path(__file__).resolve().parent.parent.parent

# FRONTEND_DIR = BASE_DIR / "frontend"

# # Serve CSS, JS, Images
# app.mount(
#     "/",
#     StaticFiles(directory=str(FRONTEND_DIR), html=True),
#     name="frontend",
# )

# # Home Page
# @app.get("/")
# def home():
#     return FileResponse(
#         FRONTEND_DIR/"index.html"
#     )

app.include_router(generate.router)
# app.include_router(auth.router)

