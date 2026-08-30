def format_paper(section_a, section_b):
    output = ""

    # Header
    output += "\n==============================\n"
    output += "      SESSIONAL PAPER\n"
    output += "==============================\n\n"

    # Section A
    output += "SECTION A (5 × 1 = 5 marks)\n\n"
    for i, row in enumerate(section_a.itertuples(), 1):
        output += f"{chr(64+i)}. {row.question_text}\n"

    # Section B
    output += "\nSECTION B (Attempt any one from each)\n\n"

    for i, (q1, q2) in enumerate(section_b, 2):
        output += f"Q{i}. (A) {q1.question_text}\n"
        output += f"     (B) {q2.question_text}\n\n"

    return output