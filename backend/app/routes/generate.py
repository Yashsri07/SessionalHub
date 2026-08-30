from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.services.generator_service import generate_paper
from app.services.pdf_service import generate_pdf
from app.services.generator_service import load_data #added
from app.models.paper_request import PaperRequest #added

# router = APIRouter()


router = APIRouter()

@router.get("/subjects") #added
def get_subjects():

    df = load_data()

    subjects = (
        df["subject_name"]
        .dropna()
        .unique()
        .tolist()
    )

    return {
    "subjects": [
        {
            "name": "Operating Systems",
            "code": "BCS401",
            "units": 4,
            "enabled": True
        },
        {
            "name": "DBMS",
            "code": "BCS402",
            "units": 5,
            "enabled": False
        },
        {
            "name": "Computer Networks",
            "code": "BCS403",
            "units": 5,
            "enabled": False
        }
    ]
}

@router.get("/units/{subject}")
def get_units(subject: str):

    df = load_data()

    df = df[df["subject_name"] == subject]

    result = []

    for unit in sorted(df["unit_number"].unique()):

        unit_df = df[df["unit_number"] == unit]

        topics = (
            unit_df["topic_name"]
            .dropna()
            .unique()
            .tolist()
        )

        result.append({
            "number": int(unit),
            "topics": topics
        })

    return {
        "units": result
    }

@router.get("/topics/{subject}")
def get_topics(subject: str):

    df = load_data()

    df = df[
        df["subject_name"] == subject
    ]

    topics = (
        df["topic_name"]
        .dropna()
        .unique()
        .tolist()
    )

    return {
        "topics": topics
    }
    
@router.post("/generate-paper")
def generate(req: PaperRequest):

    return generate_paper(
        req.subject,
        req.units,
        req.topics,
        req.difficulty,
        req.marks
    )

@router.get("/download-paper")
def download_paper():
    result = generate_paper()
    pdf_path = generate_pdf(result["paper"])
    return FileResponse(pdf_path, media_type='application/pdf', filename="sessional_paper.pdf")