from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database import Base


class GeneratedPaper(Base):

    __tablename__ = "generated_papers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    subject = Column(String)

    units = Column(String)

    topics = Column(Text)

    difficulty = Column(String)

    marks = Column(Integer)

    paper_content = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )