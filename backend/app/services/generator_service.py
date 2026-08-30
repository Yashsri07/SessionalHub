import pandas as pd
import random

from app.config import SECTION_A_COUNT, SECTION_B_PAIRS, MARKS_A, MARKS_B
from ..utils.helper import select_questions, build_pairs
from ..utils.formatter import format_paper


def load_data():
    try:
        df = pd.read_csv("data/questions.csv")
        return df
    except Exception as e:
        raise Exception(f"Error loading dataset: {e}")


def generate_paper(subject,
    units,
    topics,
    difficulty,
    marks):
    # Load dataset
    df = load_data()

    df = df[
    df["subject_name"] == subject
    ]

    df = df[
    df["unit_number"].isin(units)
    ]

    if topics:
        df = df[
        df["topic_name"].isin(topics)
        ]

    if difficulty != "Mixed":

        df = df[
            df["difficulty_level"] == difficulty
        ]

    if df.empty:
        raise ValueError(
            "No questions found for the selected subject, units, and difficulty."
        )

    # -----------------------------
    # SECTION A (1 mark questions)
    # -----------------------------
    section_a_questions = select_questions(
        df=df,
        marks=MARKS_A,
        count=SECTION_A_COUNT
    )

    # -----------------------------
    # SECTION B (3 mark questions)
    # -----------------------------
    section_b_questions = select_questions(
        df=df,
        marks=MARKS_B,
        count=SECTION_B_PAIRS * 2
    )

    section_b_pairs = build_pairs(section_b_questions)

    # -----------------------------
    # FORMAT FINAL PAPER
    # -----------------------------
    paper = format_paper(section_a_questions, section_b_pairs)

    return {
        "status": "success",
        "paper": paper
    }



