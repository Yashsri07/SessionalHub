from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)


def check_username(db: Session, username: str):

    user = db.query(User).filter(
        User.username == username
    ).first()

    if user:
        return {
            "available": False,
            "message": "username already taken"
        }

    return {
        "available": True,
        "message": "username available"
    }


def register_user(db: Session, data):

    hashed_password = hash_password(data.password)

    user = User(
        full_name=data.full_name,
        username=data.username,
        role=data.role,
        gmail=data.gmail,
        password=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Registration successful",
        "userId": user.id
    }


def login_user(db: Session, data):

    user = db.query(User).filter(
        (
            (User.username == data.identifier)
            |
            (User.gmail == data.identifier)
        )
        &
        (User.role == data.role)
    ).first()

    if not user:
        return None

    if not verify_password(
        data.password,
        user.password
    ):
        return False

    token = create_access_token(
        {
            "userId": user.id,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "role": user.role,
        "user": {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name
        }
    }