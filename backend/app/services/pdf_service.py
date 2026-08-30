from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def generate_pdf(content):
    file_path = "generated_paper.pdf"

    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter

    y = height - 40

    for line in content.split("\n"):
        c.drawString(40, y, line)
        y -= 15

        if y < 40:
            c.showPage()
            y = height - 40

    c.save()
    return file_path