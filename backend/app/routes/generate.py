from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.paper import GeneratedPaper
from app.models.paper_request import PaperRequest

from app.services.generator_service import (
    generate_paper,
    load_data
)

from app.services.pdf_service import generate_pdf


router = APIRouter()


@router.get("/subjects")
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
def generate(
    req: PaperRequest,
    db: Session = Depends(get_db)
):

    try:

        # Generate paper
        result = generate_paper(
            req.subject,
            req.units,
            req.topics,
            req.difficulty,
            req.marks,
            db
        )

        return {
            "status": "success",
            "paper_id": result["paper_id"],
            "paper": result["paper"]
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/download-paper/{paper_id}")
def download_paper(
    paper_id: int,
    db: Session = Depends(get_db)
):

    paper = db.query(
        GeneratedPaper
    ).filter(
        GeneratedPaper.id == paper_id
    ).first()

    if paper is None:
        raise HTTPException(
            status_code=404,
            detail="Paper not found"
        )

    pdf_path = generate_pdf(
        paper.paper_content
    )

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="sessional_paper.pdf"
    )