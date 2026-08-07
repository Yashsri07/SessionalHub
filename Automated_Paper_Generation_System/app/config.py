# import os
# from dotenv import load_dotenv

# load_dotenv()

# JWT_SECRET = os.getenv("JWT_SECRET")

# DATABASE_URL = os.getenv("DATABASE_URL")


# -------------------------------
# PAPER STRUCTURE CONFIGURATION
# -------------------------------

# Section A
SECTION_A_COUNT = 5      # number of questions
MARKS_A = 1              # marks per question

# Section B
SECTION_B_PAIRS = 5      # total questions (Q2–Q6)
MARKS_B = 3              # marks per question

# -------------------------------
# DATASET CONFIG
# -------------------------------

DATA_PATH = "data/questions.csv"

# -------------------------------
# OPTIONAL (Future Use)
# -------------------------------

# Difficulty distribution (for future upgrade)
EASY_RATIO = 0.3
MEDIUM_RATIO = 0.5
HARD_RATIO = 0.2

# Unit-wise control (future)
USE_UNIT_DISTRIBUTION = False

