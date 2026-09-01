import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")

DATABASE_URL = os.getenv("DATABASE_URL")


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

# ===============================
# EVALUATION / OLLAMA CONFIG
# ===============================

# class Settings:

#     # Ollama
#     ollama_url = os.getenv(
#         "OLLAMA_URL",
#         "http://127.0.0.1:11434"
#     )

#     ollama_model = os.getenv(
#         "OLLAMA_MODEL",
#         "qwen2.5:0.5b"
#     )

#     ollama_context_length = int(
#         os.getenv("OLLAMA_CONTEXT_LENGTH", "2048")
#     )

#     ollama_num_gpu = int(
#         os.getenv("OLLAMA_NUM_GPU", "0")
#     )

#     ollama_executable = os.getenv(
#         "OLLAMA_EXECUTABLE",
#         ""
#     )

#         # Tesseract OCR
#     tesseract_cmd = os.getenv(
#         "TESSERACT_CMD",
#         r"C:\Program Files\Tesseract-OCR\tesseract.exe"
#     )

#     # Evaluation storage
#     data_dir = Path(
#         os.getenv(
#             "EVALUATION_DATA_DIR",
#             "data"
#         )
#     )

#     # Upload limit
#     max_upload_mb = int(
#         os.getenv(
#             "MAX_UPLOAD_MB",
#             "20"
#         )
#     )

#     # CORS
#     allowed_origins = os.getenv(
#         "ALLOWED_ORIGINS",
#         "*"
#     )


# settings = Settings()