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
FONT_PATH = ROOT / "assets" / "fonts" / "PPNeueMontreal-Medium.woff2"

INK = colors.HexColor("#1D1D1B")
BLUE = colors.HexColor("#6F665B")
MUTED = colors.HexColor("#6A6761")
RULE = colors.HexColor("#D8D2C8")
PAPER = colors.HexColor("#FAF9F6")


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
    canvas.setFillColor(INK)
    canvas.rect(0, height - 3 * mm, width, 3 * mm, stroke=0, fill=1)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(20 * mm, 10 * mm, "JAWHER HAMDI / CREATIVE RESUME")
    canvas.drawRightString(width - 20 * mm, 10 * mm, f"JAWHER HAMDI / 0{doc.page} OF 02")
    canvas.restoreState()


def make_styles(font_name):
    styles = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=styles["Normal"],
            fontName=font_name,
            fontSize=29,
            leading=30,
            textColor=INK,
            spaceAfter=2,
        ),
        "title": ParagraphStyle(
            "Title",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            tracking=0.9,
            textColor=BLUE,
            spaceAfter=5,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=10.5,
            textColor=MUTED,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.6,
            leading=10.5,
            tracking=1.1,
            textColor=BLUE,
            spaceBefore=10,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=INK,
            spaceAfter=2,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.4,
            leading=11.8,
            textColor=INK,
        ),
        "date": ParagraphStyle(
            "Date",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            alignment=TA_RIGHT,
            textColor=MUTED,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.8,
            leading=11.8,
            leftIndent=8,
            firstLineIndent=-7,
            bulletIndent=0,
            textColor=INK,
            spaceAfter=3,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.4,
            leading=11.2,
            textColor=INK,
        ),
        "project": ParagraphStyle(
            "Project",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.4,
            leading=11.6,
            textColor=INK,
            spaceAfter=1,
        ),
        "page_kicker": ParagraphStyle(
            "PageKicker",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10,
            tracking=1.2,
            textColor=BLUE,
            spaceAfter=4,
        ),
    }


def section_label(text, styles):
    return [
        Paragraph(text.upper(), styles["section"]),
        HRFlowable(width="100%", thickness=0.55, color=RULE, spaceAfter=4),
    ]


def role_row(company, role, date, styles):
    left = Paragraph(f"{role}<br/><font color='#6A6761'>{company}</font>", styles["role"])
    right = Paragraph(date, styles["date"])
    table = Table([[left, right]], colWidths=[126 * mm, 43 * mm])
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
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=17 * mm,
        bottomMargin=17 * mm,
        title="Jawher Hamdi - Creative Resume",
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
        Paragraph("ART DIRECTION / CREATIVE PRODUCTION / PRODUCT & VISUAL DESIGN", styles["title"]),
        Paragraph(
            "Tunis, Tunisia &nbsp; / &nbsp; Open to relocation and international remote work<br/>"
            "+216 22 085 367 &nbsp; / &nbsp; hamdijawher@icloud.com &nbsp; / &nbsp; "
            "<link href='https://www.jawherhamdi.com/' color='#6F665B'>jawherhamdi.com</link> &nbsp; / &nbsp; "
            "<link href='https://www.linkedin.com/in/jawher-hamdi-748349189/' color='#6F665B'>LinkedIn</link>",
            styles["contact"],
        ),
        Spacer(1, 5),
    ]

    story += section_label("Profile", styles)
    story.append(
        Paragraph(
            "Multidisciplinary designer with 5+ years leading work across enterprise data products, financial services, design systems, marketing design, campaigns, presentations, film, and photography. I connect art direction with product rigor: defining the central idea, aligning people around it, and carrying it through visual language, production, interface, and delivery.",
            styles["body"],
        )
    )

    story += section_label("Creative and design leadership", styles)
    story.append(
        Paragraph(
            "Concept development / art direction / campaign systems / team leadership / workshop facilitation / product strategy / data UX / design systems / visual storytelling / photo and video production / executive presentations",
            styles["small"],
        )
    )

    story += section_label("Creative practice", styles)
    story.append(role_row("Jay Studio / Independent practice", "Founder / Art Direction & Creative Production", "2026 - Present", styles))
    for bullet in [
        "Build creative territories from audience insight and positioning, translating the central idea into treatments, moodboards, storyboards, shot lists, campaign systems, and digital touchpoints.",
        "Direct small film and photography productions from pre-production and visual planning through on-set decisions, edit feedback, post-production, and rollout review.",
        "Shape collaborators around the work, setting the creative standard while coordinating design, image, motion, styling, and production needs.",
        "Selected independent work includes AUREA / Beyond Ordinary and Sidi Bou Said / The Blue Story.",
    ]:
        story.append(Paragraph(f"- {bullet}", styles["bullet"]))

    story += section_label("Experience", styles)
    story.append(role_row("FORVIA Faurecia / Palantir Foundry", "UX/UI Designer | Data UX & Design Process Leadership", "May 2023 - Jun 2025", styles))
    for bullet in [
        "Led the end-to-end design process for data-heavy enterprise applications, from discovery, workflow mapping, UX audits, and ideation through prototypes, interface direction, specification, and developer handoff.",
        "Created and governed a reusable design system for Palantir Foundry applications, aligning foundations, components, dashboard patterns, documentation, and design review across teams.",
        "Led designers through critique, prioritization, and quality review while aligning product owners, technical teams, and stakeholders around a coherent experience direction.",
        "Designed and facilitated R&amp;D brainstorming workshops in Paris Bercy and Nanterre, turning complex innovation topics into structured concepts, scenarios, and next steps.",
        "Extended the work beyond product screens through presentations, photo and video content, and campaign-style storytelling for innovation and internal communication.",
    ]:
        story.append(Paragraph(f"- {bullet}", styles["bullet"]))

    story.append(role_row("Addinn Group", "UX/UI Product Designer | Creative & Marketing Design", "Oct 2020 - May 2023", styles))
    for bullet in [
        "Led discovery and product design across SynapseHR, Smart Web Pay, Lait's Collecte, and financial-service products using interviews, journey mapping, UX audits, prototyping, testing, analytics, and iteration.",
        "Worked across marketing design and art direction, shaping campaign visuals, presentations, sales and communication materials, and photo and video content alongside the product work.",
        "Led designers and set visual quality across interface, marketing, and communication touchpoints, keeping the product and brand story coherent from concept through delivery.",
        "Translated ambiguous business and technical requirements into clear product direction while presenting recommendations to stakeholders and product owners.",
        "Used behavioral evidence and closed-beta feedback to refine critical financial flows around clarity, security, recovery, and user confidence.",
    ]:
        story.append(Paragraph(f"- {bullet}", styles["bullet"]))

    story.append(PageBreak())
    story.append(Paragraph("SELECTED WORK / CAPABILITIES", styles["page_kicker"]))
    story.append(HRFlowable(width="100%", thickness=0.8, color=BLUE, spaceAfter=8))
    story += section_label("Selected creative and product work", styles)
    project_rows = [
        (
            "AUREA / BEYOND ORDINARY",
            "Independent hospitality campaign study - Creative and art direction, treatment, film, photography, newspaper concept, and social rollout.",
        ),
        (
            "FORVIA / PALANTIR APPS",
            "Enterprise data experience - Design-process leadership, UX audits, reusable design system, dashboard direction, R&amp;D workshops, and innovation storytelling.",
        ),
        (
            "SMART WEB PAY",
            "Parking-payment service - Research, product strategy, experience direction, visual design, testing, and a scalable service-system foundation.",
        ),
        (
            "SIDI BOU SAID / THE BLUE STORY",
            "Independent destination film - Concept, visual direction, location study, production, edit direction, and a place-led narrative built through rhythm and detail.",
        ),
    ]
    for project, description in project_rows:
        story.append(
            KeepTogether(
                [
                    Paragraph(project, styles["project"]),
                    Paragraph(description, styles["body"]),
                    Spacer(1, 2),
                ]
            )
        )

    story += section_label("Capabilities", styles)
    story.append(
        Paragraph(
            "<b>Art direction:</b> concepts, campaign worlds, visual language, treatments, moodboards, storyboards, references, visual quality control<br/>"
            "<b>Creative production:</b> photo and video planning, shot lists, locations, props, on-set decisions, edit feedback, presentation and rollout assets<br/>"
            "<b>Product and visual design:</b> data UX, interaction design, prototyping, design systems, accessibility, dashboards, service journeys<br/>"
            "<b>Leadership and strategy:</b> team direction, critique, stakeholder alignment, workshops, research, UX audits, product definition, presentations",
            styles["small"],
        )
    )

    story += section_label("Education, credentials, tools & languages", styles)
    story.append(
        Paragraph(
            "<b>Bachelor's degree in Design</b> - Higher Institute of Arts and Multimedia of Manouba (ISAMM)<br/>"
            "<b>Credentials:</b> Google UX Design Certificate / Meta Principles of UX/UI Design / IE Business School Branding and Customer Experience<br/>"
            "<b>Tools:</b> Figma / Photoshop / Illustrator / InDesign / DaVinci Resolve / Final Cut Pro / Keynote / PowerPoint / Miro / Palantir Foundry / HTML and CSS<br/>"
            "<b>Languages:</b> English C2 / French B2",
            styles["small"],
        )
    )

    doc.build(story)
    ASSET_COPY.write_bytes(OUTPUT.read_bytes())
    print(OUTPUT)
    print(ASSET_COPY)


if __name__ == "__main__":
    build()
