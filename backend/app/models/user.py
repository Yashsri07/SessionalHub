from sqlalchemy import Column, Integer, String

from app.database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String)

    username = Column(
        String,
        unique=True,
        index=True
    )

    role = Column(String)

    gmail = Column(
        String,
        unique=True
    )

    password = Column(String)