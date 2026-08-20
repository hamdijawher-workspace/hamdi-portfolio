from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Jawher_Hamdi_Creative_Resume.pdf"
ASSET_COPY = ROOT / "assets" / "Jawher_Hamdi_Creative_Resume.pdf"
FONT_DIR = ROOT / "assets" / "fonts" / "montserrat"

INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#4C4C4C")
RULE = colors.HexColor("#111111")
LIGHT_RULE = colors.HexColor("#B8B8B8")


def register_fonts():
    pdfmetrics.registerFont(TTFont("Montserrat", str(FONT_DIR / "Montserrat-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("Montserrat-SemiBold", str(FONT_DIR / "Montserrat-SemiBold.ttf")))
    pdfmetrics.registerFont(TTFont("Montserrat-Bold", str(FONT_DIR / "Montserrat-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Montserrat-Italic", str(FONT_DIR / "Montserrat-Italic.ttf")))
    pdfmetrics.registerFontFamily(
        "Montserrat",
        normal="Montserrat",
        bold="Montserrat-Bold",
        italic="Montserrat-Italic",
        boldItalic="Montserrat-Bold",
    )


def draw_page(canvas, doc):
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(LIGHT_RULE)
    canvas.setLineWidth(0.35)
    canvas.line(18 * mm, 13.5 * mm, width - 18 * mm, 13.5 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Montserrat", 7.2)
    canvas.drawString(18 * mm, 9.5 * mm, "JAWHER HAMDI")
    canvas.drawRightString(width - 18 * mm, 9.5 * mm, f"PAGE {doc.page} OF 2")
    canvas.restoreState()


def make_styles():
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name", parent=base["Normal"], fontName="Montserrat-Bold", fontSize=20,
            leading=22, alignment=TA_CENTER, textColor=INK, spaceAfter=3,
        ),
        "headline": ParagraphStyle(
            "Headline", parent=base["Normal"], fontName="Montserrat-SemiBold", fontSize=9.2,
            leading=11, alignment=TA_CENTER, tracking=0.45, textColor=INK, spaceAfter=4,
        ),
        "contact": ParagraphStyle(
            "Contact", parent=base["Normal"], fontName="Montserrat", fontSize=8.2,
            leading=10.6, alignment=TA_CENTER, textColor=INK,
        ),
        "section": ParagraphStyle(
            "Section", parent=base["Normal"], fontName="Montserrat-Bold", fontSize=10.2,
            leading=12, tracking=0.55, textColor=INK, spaceBefore=9, spaceAfter=2,
        ),
        "summary": ParagraphStyle(
            "Summary", parent=base["Normal"], fontName="Montserrat", fontSize=9.2,
            leading=12.5, textColor=INK, spaceAfter=2,
        ),
        "organization": ParagraphStyle(
            "Organization", parent=base["Normal"], fontName="Montserrat-SemiBold", fontSize=9.4,
            leading=11.5, textColor=INK,
        ),
        "date": ParagraphStyle(
            "Date", parent=base["Normal"], fontName="Montserrat", fontSize=8.6,
            leading=11, alignment=TA_RIGHT, textColor=INK,
        ),
        "role": ParagraphStyle(
            "Role", parent=base["Normal"], fontName="Montserrat-Italic", fontSize=9,
            leading=11.3, textColor=INK, spaceAfter=2.2,
        ),
        "bullet": ParagraphStyle(
            "Bullet", parent=base["Normal"], fontName="Montserrat", fontSize=8.8,
            leading=12.1, leftIndent=9, firstLineIndent=-7, textColor=INK, spaceAfter=2.7,
        ),
        "project": ParagraphStyle(
            "Project", parent=base["Normal"], fontName="Montserrat-SemiBold", fontSize=9.2,
            leading=11.4, textColor=INK, spaceAfter=1.2,
        ),
        "detail": ParagraphStyle(
            "Detail", parent=base["Normal"], fontName="Montserrat", fontSize=8.8,
            leading=12.1, textColor=INK, spaceAfter=4,
        ),
        "skills": ParagraphStyle(
            "Skills", parent=base["Normal"], fontName="Montserrat", fontSize=8.8,
            leading=12.2, textColor=INK, spaceAfter=2,
        ),
    }


def section_label(text, styles):
    return [
        Paragraph(text.upper(), styles["section"]),
        HRFlowable(width="100%", thickness=0.65, color=RULE, spaceAfter=4),
    ]


def organization_row(organization, date, styles):
    row = Table(
        [[Paragraph(organization, styles["organization"]), Paragraph(date, styles["date"])]],
        colWidths=[132 * mm, 42 * mm],
    )
    row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return row


def add_experience(story, organization, date, role, bullets, styles):
    story.append(KeepTogether([
        organization_row(organization, date, styles),
        Paragraph(role, styles["role"]),
        Paragraph(f"- {bullets[0]}", styles["bullet"]),
    ]))
    for bullet in bullets[1:]:
        story.append(Paragraph(f"- {bullet}", styles["bullet"]))
    story.append(Spacer(1, 2.5))


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    styles = make_styles()
    doc = BaseDocTemplate(
        str(OUTPUT), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=15 * mm, bottomMargin=17 * mm,
        title="Jawher Hamdi - Resume", author="Jawher Hamdi",
        subject="Art direction, creative production, and product design",
    )
    frame = Frame(
        doc.leftMargin, doc.bottomMargin, doc.width, doc.height,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame], onPage=draw_page)])

    story = [
        Paragraph("JAWHER HAMDI", styles["name"]),
        Paragraph("ART DIRECTION | CREATIVE PRODUCTION | PRODUCT DESIGN", styles["headline"]),
        Paragraph(
            "Tunis, Tunisia | Open to relocation and international remote work<br/>"
            "+216 22 085 367 | hamdijawher@icloud.com | "
            "<link href='https://www.jawherhamdi.com/' color='#111111'>jawherhamdi.com</link> | "
            "<link href='https://www.linkedin.com/in/jawher-hamdi-748349189/' color='#111111'>LinkedIn</link>",
            styles["contact"],
        ),
        Spacer(1, 4),
    ]

    story += section_label("Profile", styles)
    story.append(Paragraph(
        "Multidisciplinary designer with 5+ years of experience across enterprise data products, financial services, design systems, marketing design, campaigns, film, and photography. Connects strategic product thinking with art direction and creative production to carry a clear central idea from discovery through delivery.",
        styles["summary"],
    ))

    story += section_label("Professional Experience", styles)
    add_experience(
        story, "JAY STUDIO / INDEPENDENT PRACTICE", "2026 - Present",
        "Founder - Art Direction and Creative Production",
        [
            "Develop creative territories from audience insight and positioning, translating central ideas into treatments, moodboards, storyboards, shot lists, campaign systems, and digital touchpoints.",
            "Direct small film and photography productions from pre-production and visual planning through on-set decisions, edit feedback, post-production, and rollout review.",
            "Coordinate design, image, motion, styling, and production collaborators around a consistent creative standard.",
        ], styles,
    )
    add_experience(
        story, "FORVIA FAURECIA / PALANTIR FOUNDRY", "May 2023 - Jun 2025",
        "UX/UI Designer - Data UX and Design Process Leadership",
        [
            "Led end-to-end design for data-heavy enterprise applications, covering discovery, workflow mapping, UX audits, ideation, prototyping, interface direction, specification, and developer handoff.",
            "Created and governed a reusable design system for Palantir Foundry applications, aligning foundations, components, dashboard patterns, documentation, and design review across teams.",
            "Directed designers through critique, prioritization, and quality review while aligning product owners, technical teams, and stakeholders around a coherent experience direction.",
            "Designed and facilitated R&amp;D workshops in Paris Bercy and Nanterre, converting complex innovation topics into structured concepts, scenarios, and next steps.",
            "Extended product work through executive presentations, photo and video content, and campaign-style storytelling for innovation and internal communication.",
        ], styles,
    )
    add_experience(
        story, "ADDINN GROUP", "Oct 2020 - May 2023",
        "UX/UI Product Designer - Creative and Marketing Design",
        [
            "Led discovery and product design across SynapseHR, Smart Web Pay, Lait's Collecte, and financial-service products using interviews, journey mapping, UX audits, prototyping, testing, analytics, and iteration.",
            "Shaped campaign visuals, presentations, sales and communication materials, and photo and video content alongside the product work.",
            "Set visual quality across interface, marketing, and communication touchpoints while guiding designers from concept through delivery.",
            "Translated ambiguous business and technical requirements into clear product direction and presented recommendations to stakeholders and product owners.",
        ], styles,
    )

    story.append(PageBreak())
    story += section_label("Selected Creative and Product Work", styles)
    projects = [
        ("AUREA / BEYOND ORDINARY - Independent Hospitality Campaign Study",
         "Defined the campaign territory and directed treatment, film, photography, newspaper concept, and social rollout around a restrained hospitality narrative."),
        ("DELISHIO / TASTE THE COLD - Independent Social Campaign Study",
         "Built a tactile summer campaign world through temperature, colour, texture, movement, portrait film, product imagery, and social-first cutdowns."),
        ("SMART WEB PAY - Parking Payment Service",
         "Led research, product strategy, experience direction, visual design, testing, and service-system definition for clearer, more trustworthy payment flows."),
        ("SIDI BOU SAID / THE BLUE STORY - Independent Destination Film",
         "Set concept and visual direction, completed the location study, guided production and editing, and built a place-led narrative through rhythm and detail."),
    ]
    for project, detail in projects:
        story.append(KeepTogether([
            Paragraph(project, styles["project"]),
            Paragraph(detail, styles["detail"]),
        ]))

    story += section_label("Core Capabilities", styles)
    story.append(Paragraph(
        "<b>Art direction:</b> Concept development, campaign worlds, visual language, treatments, moodboards, storyboards, references, and visual quality control<br/>"
        "<b>Creative production:</b> Film and photography planning, shot lists, locations, props, on-set decisions, edit feedback, presentations, and rollout assets<br/>"
        "<b>Product design:</b> Research, product strategy, data UX, interaction design, prototyping, design systems, accessibility, dashboards, and service journeys<br/>"
        "<b>Leadership:</b> Team direction, critique, stakeholder alignment, workshops, UX audits, prioritization, product definition, and presentations",
        styles["skills"],
    ))

    story += section_label("Education and Credentials", styles)
    story.append(Paragraph(
        "<b>Bachelor's Degree in Design</b>, Higher Institute of Arts and Multimedia of Manouba (ISAMM)<br/>"
        "Google UX Design Certificate | Meta Principles of UX/UI Design | IE Business School Branding and Customer Experience",
        styles["skills"],
    ))

    story += section_label("Tools and Languages", styles)
    story.append(Paragraph(
        "<b>Tools:</b> Figma, Photoshop, Illustrator, InDesign, DaVinci Resolve, Final Cut Pro, Keynote, PowerPoint, Miro, Palantir Foundry, HTML, CSS<br/>"
        "<b>Languages:</b> English C2 | French B2",
        styles["skills"],
    ))

    doc.build(story)
    ASSET_COPY.write_bytes(OUTPUT.read_bytes())
    print(OUTPUT)
    print(ASSET_COPY)


if __name__ == "__main__":
    build()
