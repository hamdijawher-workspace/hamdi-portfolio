from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Jawher_Hamdi_Creative_Resume.pdf"
ASSET_COPY = ROOT / "assets" / "Jawher_Hamdi_Creative_Resume.pdf"
FONT_PATH = ROOT / "assets" / "fonts" / "PPNeueMontreal-Medium.woff2"

INK = colors.HexColor("#161A1D")
BLUE = colors.HexColor("#2648D8")
MUTED = colors.HexColor("#5E6268")
RULE = colors.HexColor("#D9DCE1")
PAPER = colors.HexColor("#F7F6F2")


def register_fonts():
    # ReportLab may not support WOFF2 in every environment. Keep a reliable fallback.
    try:
        pdfmetrics.registerFont(TTFont("NeueMontreal", str(FONT_PATH)))
        return "NeueMontreal"
    except Exception:
        return "Helvetica"


def draw_page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, stroke=0, fill=1)
    canvas.setFillColor(BLUE)
    canvas.rect(0, height - 8 * mm, width, 8 * mm, stroke=0, fill=1)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(16 * mm, 9 * mm, "JAWHER HAMDI / CREATIVE RESUME")
    canvas.drawRightString(width - 16 * mm, 9 * mm, "Portfolio identity: Jay Hamdi")
    canvas.restoreState()


def make_styles(font_name):
    styles = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=styles["Normal"],
            fontName=font_name,
            fontSize=26,
            leading=27,
            textColor=INK,
            spaceAfter=2,
        ),
        "title": ParagraphStyle(
            "Title",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=12,
            tracking=0.7,
            textColor=BLUE,
            spaceAfter=5,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=7.7,
            leading=10,
            textColor=MUTED,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.2,
            leading=10,
            tracking=1.1,
            textColor=BLUE,
            spaceBefore=5,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.25,
            leading=10.6,
            textColor=INK,
            spaceAfter=2,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.65,
            leading=10.4,
            textColor=INK,
        ),
        "date": ParagraphStyle(
            "Date",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=7.5,
            leading=9.5,
            alignment=TA_RIGHT,
            textColor=MUTED,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.05,
            leading=10.3,
            leftIndent=8,
            firstLineIndent=-7,
            bulletIndent=0,
            textColor=INK,
            spaceAfter=1.2,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=7.65,
            leading=9.7,
            textColor=INK,
        ),
    }


def section_label(text, styles):
    return [
        Paragraph(text.upper(), styles["section"]),
        HRFlowable(width="100%", thickness=0.55, color=RULE, spaceAfter=4),
    ]


def role_row(company, role, date, styles):
    left = Paragraph(f"{role}<br/><font color='#5E6268'>{company}</font>", styles["role"])
    right = Paragraph(date, styles["date"])
    table = Table([[left, right]], colWidths=[131 * mm, 38 * mm])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
            ]
        )
    )
    return table


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    font_name = register_fonts()
    styles = make_styles(font_name)

    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=15 * mm,
        title="Jawher Hamdi — Creative Resume",
        author="Jawher Hamdi",
        subject="Art direction, creative production, and product design",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame], onPage=draw_page)])

    story = [
        Paragraph("JAWHER HAMDI", styles["name"]),
        Paragraph("ART DIRECTION / CREATIVE PRODUCTION / PRODUCT DESIGN", styles["title"]),
        Paragraph(
            "Tunis, Tunisia · Open to relocation and international remote work<br/>"
            "+216 22 085 367 · hamdijawher@icloud.com · "
            "<link href='https://www.jawherhamdi.com/' color='#2648D8'>jawherhamdi.com</link> · "
            "<link href='https://www.linkedin.com/in/jawher-hamdi-748349189/' color='#2648D8'>LinkedIn</link>",
            styles["contact"],
        ),
        Spacer(1, 3),
    ]

    story += section_label("Profile", styles)
    story.append(
        Paragraph(
            "Multidisciplinary designer with five years of experience in product and experience design, now building an independent practice across art direction and creative production. I connect audience insight, visual storytelling, production planning, and systems thinking to carry an idea from concept to final frame or interface.",
            styles["body"],
        )
    )

    story += section_label("Creative practice", styles)
    story.append(role_row("Jay Studio / Independent practice", "Founder / Art Direction & Creative Production", "2026—Present", styles))
    for bullet in [
        "Develop concepts, treatments, moodboards, storyboards, shot lists, and visual systems for film, photography, social content, and digital experiences.",
        "Plan and direct small productions from pre-production through shoot decisions, edit feedback, and delivery review.",
        "Selected independent work: AUREA / Beyond Ordinary, DELISHIO / Taste the Cold, and Sidi Bou Said / The Blue Story.",
    ]:
        story.append(Paragraph(f"- {bullet}", styles["bullet"]))

    story += section_label("Product & experience design", styles)
    story.append(role_row("FORVIA Faurecia / Palantir Foundry", "UX/UI Designer", "May 2023—Jun 2025", styles))
    for bullet in [
        "Designed data-heavy enterprise dashboards and use cases, turning complex operational workflows into clearer decision-making experiences.",
        "Built and documented reusable design-system patterns for designers and developers; conducted UX audits and facilitated an R&amp;D ideation workshop in Paris-Nanterre.",
    ]:
        story.append(Paragraph(f"- {bullet}", styles["bullet"]))
    story.append(Spacer(1, 2))
    story.append(role_row("Addinn Group", "UX/UI Product Designer", "Oct 2020—May 2023", styles))
    for bullet in [
        "Led discovery and product design across HR, agriculture, and financial products through interviews, journey mapping, prototyping, testing, and iteration.",
        "Translated ambiguous requirements into buildable product direction while balancing user needs, business goals, and technical constraints.",
    ]:
        story.append(Paragraph(f"- {bullet}", styles["bullet"]))

    story += section_label("Capabilities", styles)
    story.append(
        Paragraph(
            "<b>Direction:</b> concepts, campaign thinking, visual language, treatments, moodboards, storyboards, references, quality control &nbsp;&nbsp; "
            "<b>Production:</b> shot planning, location and prop direction, on-set decisions, edit feedback, rollout assets<br/>"
            "<b>Design:</b> visual design, UX/UI, prototyping, design systems, accessibility, user journeys &nbsp;&nbsp; "
            "<b>Research:</b> interviews, workshops, UX audits, journey mapping, usability testing",
            styles["small"],
        )
    )

    story += section_label("Education, tools & languages", styles)
    story.append(
        Paragraph(
            "<b>Bachelor's degree in Design</b> — Higher Institute of Arts and Multimedia of Manouba (ISAMM)<br/>"
            "<b>Tools:</b> Figma, Photoshop, Illustrator, InDesign, DaVinci Resolve, Final Cut Pro, Keynote, Miro, Palantir Foundry, HTML/CSS<br/>"
            "<b>Languages:</b> English (C2) · French (B2)",
            styles["small"],
        )
    )

    doc.build(story)
    ASSET_COPY.write_bytes(OUTPUT.read_bytes())
    print(OUTPUT)
    print(ASSET_COPY)


if __name__ == "__main__":
    build()
