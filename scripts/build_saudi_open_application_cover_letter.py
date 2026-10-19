from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Hamdi_Jawher_Open_Application_Cover_Letter_Saudi_Arabia.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#17202C")
NAVY = colors.HexColor("#123B67")
BLUE = colors.HexColor("#1E65A8")
MUTED = colors.HexColor("#667181")
PALE = colors.HexColor("#E8EEF5")


def register_fonts() -> tuple[str, str]:
    font_dir = ROOT / "assets" / "fonts" / "montserrat"
    regular = font_dir / "Montserrat-Regular.ttf"
    semibold = font_dir / "Montserrat-SemiBold.ttf"
    if regular.exists() and semibold.exists():
        pdfmetrics.registerFont(TTFont("Montserrat", str(regular)))
        pdfmetrics.registerFont(TTFont("Montserrat-Semibold", str(semibold)))
        return "Montserrat", "Montserrat-Semibold"
    return "Helvetica", "Helvetica-Bold"


BODY_FONT, DISPLAY_FONT = register_fonts()


styles = {
    "name": ParagraphStyle(
        "Name",
        fontName=DISPLAY_FONT,
        fontSize=22,
        leading=24,
        textColor=NAVY,
        spaceAfter=4,
    ),
    "role": ParagraphStyle(
        "Role",
        fontName=DISPLAY_FONT,
        fontSize=10.2,
        leading=13,
        textColor=BLUE,
        tracking=0.4,
        spaceAfter=4,
    ),
    "contact": ParagraphStyle(
        "Contact",
        fontName=BODY_FONT,
        fontSize=8.4,
        leading=11,
        textColor=MUTED,
    ),
    "eyebrow": ParagraphStyle(
        "Eyebrow",
        fontName=DISPLAY_FONT,
        fontSize=8.4,
        leading=10,
        textColor=BLUE,
        tracking=0.8,
        spaceAfter=5,
    ),
    "title": ParagraphStyle(
        "Title",
        fontName=DISPLAY_FONT,
        fontSize=17,
        leading=21,
        textColor=INK,
        spaceAfter=18,
    ),
    "body": ParagraphStyle(
        "Body",
        fontName=BODY_FONT,
        fontSize=9.65,
        leading=14.25,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=10,
    ),
    "signature": ParagraphStyle(
        "Signature",
        fontName=DISPLAY_FONT,
        fontSize=10.2,
        leading=14,
        textColor=NAVY,
        spaceBefore=1,
    ),
}


def header_footer(canvas, doc):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(PALE)
    canvas.setLineWidth(0.6)
    canvas.line(20 * mm, 14 * mm, width - 20 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(BODY_FONT, 7.5)
    canvas.drawString(20 * mm, 9.5 * mm, "HAMDI JAWHER  /  OPEN APPLICATION  /  SAUDI ARABIA")
    canvas.drawRightString(width - 20 * mm, 9.5 * mm, "21 AUGUST 2026")
    canvas.restoreState()


def build() -> None:
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=17 * mm,
        bottomMargin=20 * mm,
        title="Open Application - Senior Product Designer / UX/UI Designer",
        author="Hamdi Jawher",
        subject="Open application for product design opportunities in Saudi Arabia",
    )

    story = []
    story.append(Paragraph("HAMDI JAWHER", styles["name"]))
    story.append(Paragraph("SENIOR PRODUCT DESIGNER  /  UX/UI DESIGNER", styles["role"]))

    contact = Table(
        [[
            Paragraph("Tunis, Tunisia", styles["contact"]),
            Paragraph("+216 22 085 367", styles["contact"]),
            Paragraph('<link href="mailto:hamdijawher@icloud.com" color="#667181">hamdijawher@icloud.com</link>', styles["contact"]),
            Paragraph('<link href="https://www.jawherhamdi.com/" color="#667181">jawherhamdi.com</link>', styles["contact"]),
        ]],
        colWidths=[33 * mm, 35 * mm, 59 * mm, 43 * mm],
        hAlign="LEFT",
    )
    contact.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (0, 0), 0),
        ("LEFTPADDING", (1, 0), (-1, 0), 8),
        ("RIGHTPADDING", (0, 0), (-1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(contact)
    story.append(Spacer(1, 9 * mm))

    rule = Table([[""]], colWidths=[170 * mm], rowHeights=[0.8 * mm])
    rule.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), BLUE)]))
    story.append(rule)
    story.append(Spacer(1, 8 * mm))

    story.append(Paragraph("OPEN APPLICATION  /  SAUDI ARABIA", styles["eyebrow"]))
    story.append(Paragraph("Senior Product Designer / UX/UI Designer", styles["title"]))
    story.append(Paragraph("Dear Hiring Team,", styles["body"]))

    paragraphs = [
        "I am writing to be considered for current or future Senior Product Designer and UX/UI opportunities within your organization. I bring more than five years of experience designing complex digital products and services across international, automotive, financial, and enterprise environments, supported by a strong foundation in visual direction and creative production.",
        "At TLScontact, I lead end-to-end UX/UI design for a next-generation biometric data-capture kiosk. My work combines international user research across 10 visa centres, accessibility, multilingual interaction patterns, high-fidelity prototyping, and alignment with product, operational, and executive stakeholders.",
        "Previously at FORVIA, I redesigned data-heavy applications built with Palantir Foundry and developed reusable design-system patterns for designers and developers. Earlier at Addinn Group, I led research and product design across fintech and SaaS products, using interviews, journey mapping, usability testing, closed-beta analytics, and A/B evidence to turn ambiguous requirements into clear, buildable experiences.",
        "What differentiates me is the ability to connect product logic with visual judgment. Through my independent practice, Jay Studio, I also develop concepts, visual systems, treatments, photography, film, and campaign assets. This helps me carry a coherent idea from research and strategy through interface detail, stakeholder communication, and final execution.",
        "I would bring a rigorous approach to simplifying complex services, building scalable systems, collaborating closely with product and engineering teams, and delivering polished experiences that users can understand and trust. I am currently based in Tunis and am open to relocating to Saudi Arabia for the right opportunity.",
        'My resume is attached, and selected work is available at <link href="https://www.jawherhamdi.com/" color="#1E65A8"><u>www.jawherhamdi.com</u></link>. I would welcome a conversation about how my background could support your current or upcoming digital initiatives.',
        "Thank you for your consideration.",
    ]
    for paragraph in paragraphs:
        story.append(Paragraph(paragraph, styles["body"]))

    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Hamdi Jawher", styles["signature"]))
    story.append(Paragraph("Senior Product Designer / UX/UI Designer", styles["contact"]))

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)


if __name__ == "__main__":
    build()
    print(OUTPUT)
