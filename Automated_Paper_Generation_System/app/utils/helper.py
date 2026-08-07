import pandas as pd
import random


def select_questions(df, marks, count):
    """
    Select questions based on marks
    """
    filtered = df[df["marks"] == marks]

    if filtered.empty:
        raise ValueError(f"No {marks}-mark questions found for the selected filters.")

    # Handle shortage of questions
    

    if len(filtered) < count:
        repeat_times = (count // len(filtered)) + 1
        filtered = pd.concat([filtered] * repeat_times)

    # Random selection
    selected = filtered.sample(n=count).reset_index(drop=True)

    return selected


def build_pairs(questions):
    """
    Convert list of questions into (A/B) pairs
    """
    pairs = []

    for i in range(0, len(questions), 2):
        q1 = questions.iloc[i]
        q2 = questions.iloc[i + 1]
        pairs.append((q1, q2))

    return pairs
