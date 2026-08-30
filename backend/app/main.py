from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import os

from app.routes import generate
from app.routes import auth
from app.database import Base
from app.database import engine

Base.metadata.create_all(bind=engine)



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# FRONTEND PATH
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

FRONTEND_DIR = BASE_DIR / "frontend"


# ==========================================
# CSS / JS / IMAGES
# ==========================================

app.mount(
    "/static",
    StaticFiles(directory=str(FRONTEND_DIR)),
    name="static"
)


# ==========================================
# HTML PAGES
# ==========================================

@app.get("/")
def home():
    return FileResponse(
        FRONTEND_DIR / "index.html"
    )


@app.get("/login.html")
def login_page():
    return FileResponse(
        FRONTEND_DIR / "login.html"
    )


@app.get("/register.html")
def register_page():
    return FileResponse(
        FRONTEND_DIR / "register.html"
    )


@app.get("/student-dashboard.html")
def student_dashboard():
    return FileResponse(
        FRONTEND_DIR / "student-dashboard.html"
    )


@app.get("/teacher-dashboard.html")
def teacher_dashboard():
    return FileResponse(
        FRONTEND_DIR / "teacher-dashboard.html"
    )


@app.get("/admin-dashboard.html")
def admin_dashboard():
    return FileResponse(
        FRONTEND_DIR / "admin-dashboard.html"
    )


@app.get("/generate-paper.html")
def generate_paper_page():
    return FileResponse(
        FRONTEND_DIR / "generate-paper.html"
    )



app.include_router(generate.router)
app.include_router(auth.router)

