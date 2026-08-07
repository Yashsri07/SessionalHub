from pydantic import BaseModel

class PaperRequest(BaseModel):

    subject: str

    units: list[int]

    topics: list[str]
    difficulty: str

    marks: int