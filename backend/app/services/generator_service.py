import pandas as pd

from app.config import (
    SECTION_A_COUNT,
    SECTION_B_PAIRS,
    MARKS_A,
    MARKS_B
)

from ..utils.helper import (
    select_questions,
    build_pairs
)

from ..utils.formatter import format_paper

from app.models.paper import GeneratedPaper


def load_data():

    try:

        df = pd.read_csv(
            "data/questions.csv"
        )

        return df

    except Exception as e:

        raise Exception(
            f"Error loading dataset: {e}"
        )


def generate_paper(
    subject,
    units,
    topics,
    difficulty,
    marks,
    db
):

    # ==========================================
    # LOAD DATA
    # ==========================================

    df = load_data()


    # ==========================================
    # FILTER SUBJECT
    # ==========================================

    df = df[
        df["subject_name"] == subject
    ]


    # ==========================================
    # FILTER UNITS
    # ==========================================

    df = df[
        df["unit_number"].isin(units)
    ]


    # ==========================================
    # FILTER TOPICS
    # ==========================================

    if topics:

        df = df[
            df["topic_name"].isin(topics)
        ]


    # ==========================================
    # FILTER DIFFICULTY
    # ==========================================

    if difficulty != "Mixed":

        df = df[
            df["difficulty_level"] == difficulty
        ]


    # ==========================================
    # CHECK QUESTIONS
    # ==========================================

    if df.empty:

        raise ValueError(
            "No questions found for the selected subject, units, and difficulty."
        )


    # ==========================================
    # SECTION A
    # ==========================================

    section_a_questions = select_questions(
        df=df,
        marks=MARKS_A,
        count=SECTION_A_COUNT
    )


    # ==========================================
    # SECTION B
    # ==========================================

    section_b_questions = select_questions(
        df=df,
        marks=MARKS_B,
        count=SECTION_B_PAIRS * 2
    )


    section_b_pairs = build_pairs(
        section_b_questions
    )


    # ==========================================
    # FORMAT PAPER
    # ==========================================

    paper = format_paper(
        section_a_questions,
        section_b_pairs
    )


    # ==========================================
    # SAVE TO DATABASE
    # ==========================================

    generated_paper = GeneratedPaper(

        subject=subject,

        units=",".join(
            map(str, units)
        ),

        topics=",".join(topics),

        difficulty=difficulty,

        marks=marks,

        paper_content=paper
    )


    db.add(generated_paper)

    db.commit()

    db.refresh(generated_paper)


    # ==========================================
    # RETURN
    # ==========================================

    return {
        "status": "success",
        "paper_id": generated_paper.id,
        "paper": paper
    }