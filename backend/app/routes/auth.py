from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.schemas import (
    RegisterRequest,
    LoginRequest
)

from app.services.auth_service import (
    check_username,
    register_user,
    login_user
)

from app.utils.security import get_current_user

router = APIRouter(
    tags=["Authentication"]
)


@router.get("/check-username/{username}")
def username(
    username: str,
    db: Session = Depends(get_db)
):

    return check_username(
        db,
        username
    )


@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    return register_user(
        db,
        data
    )


@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    result = login_user(
        db,
        data
    )

    if result is None:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    if result is False:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return result


@router.get("/profile")
def profile(
    current_user=Depends(
        get_current_user
    )
):

    return {
        "id": current_user.id,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role
    }