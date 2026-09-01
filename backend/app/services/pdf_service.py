from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from pathlib import Path


def generate_pdf(content):

    # backend/generated_pdfs folder
    BASE_DIR = Path(__file__).resolve().parent.parent.parent

    PDF_DIR = BASE_DIR / "generated_pdfs"
    PDF_DIR.mkdir(parents=True, exist_ok=True)

    pdf_path = PDF_DIR / "sessional_paper.pdf"

    # IMPORTANT: ReportLab ko string path dena hai
    c = canvas.Canvas(str(pdf_path), pagesize=letter)

    width, height = letter

    y = height - 40

    for line in content.split("\n"):

        c.drawString(40, y, line)

        y -= 15

        if y < 40:
            c.showPage()
            y = height - 40

    c.save()

    return str(pdf_path)