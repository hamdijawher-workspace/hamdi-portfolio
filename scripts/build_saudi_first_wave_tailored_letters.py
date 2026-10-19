from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf" / "saudi-first-wave"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

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

STYLES = {
    "name": ParagraphStyle("Name", fontName=DISPLAY_FONT, fontSize=22, leading=24, textColor=NAVY, spaceAfter=4),
    "role": ParagraphStyle("Role", fontName=DISPLAY_FONT, fontSize=10.2, leading=13, textColor=BLUE, tracking=0.4, spaceAfter=4),
    "contact": ParagraphStyle("Contact", fontName=BODY_FONT, fontSize=8.4, leading=11, textColor=MUTED),
    "eyebrow": ParagraphStyle("Eyebrow", fontName=DISPLAY_FONT, fontSize=8.2, leading=10, textColor=BLUE, tracking=0.7, spaceAfter=5),
    "title": ParagraphStyle("Title", fontName=DISPLAY_FONT, fontSize=16.5, leading=20, textColor=INK, spaceAfter=16),
    "body": ParagraphStyle("Body", fontName=BODY_FONT, fontSize=9.35, leading=13.75, textColor=INK, alignment=TA_LEFT, spaceAfter=9.5),
    "signature": ParagraphStyle("Signature", fontName=DISPLAY_FONT, fontSize=10.2, leading=14, textColor=NAVY, spaceBefore=1),
}


TARGETS = [
    {
        "slug": "Al_Dawaa",
        "company": "Al-Dawaa Medical Services",
        "recipient": "cv@aldawaa.com.sa",
        "why": "Al-Dawaa's combination of pharmacy, e-commerce, home delivery, order-and-collect, prescription services, and digital consultations creates exactly the kind of connected service ecosystem I enjoy designing for: one where clarity, trust, accessibility, and operational reality must work together across every touchpoint.",
        "match": "My current TLScontact work is directly relevant to that challenge. I lead UX/UI design for a biometric self-service experience, using international research, accessibility principles, multilingual interaction patterns, and high-fidelity prototyping to reduce friction in a high-trust journey. Earlier fintech work at Addinn Group strengthened my ability to design secure transactions, interpret analytics, and improve flows through usability testing and A/B evidence.",
        "close": "I would welcome the opportunity to help Al-Dawaa make digital healthcare and retail services easier to understand, safer to use, and more coherent across app, web, branch, and support channels.",
    },
    {
        "slug": "Rawabi_Holding",
        "company": "Rawabi Holding",
        "recipient": "recruitment@rawabiholding.com",
        "why": "Rawabi's focus on next-generation technology, operational excellence, and sustainable solutions across energy, industrial services, contracting, and real estate is a strong match for my experience translating complex operational environments into usable digital systems.",
        "match": "At FORVIA, I redesigned data-heavy applications built with Palantir Foundry, turning complex workflows into clearer dashboards and reusable design-system patterns for designers and developers. That work required close collaboration with technical teams and stakeholders, a practical understanding of operational constraints, and disciplined decisions about information hierarchy, states, and governance.",
        "close": "I would be excited to support Rawabi's digital initiatives by making data, workflows, and enterprise services easier for people to understand and act on without losing the rigor required by industrial environments.",
    },
    {
        "slug": "dnata",
        "company": "dnata",
        "recipient": "careers@dnata.com",
        "why": "dnata's global service footprint and its ambition to deliver consistent, personalized experiences across customer-facing and operational touchpoints make it especially relevant to my international service-design background.",
        "match": "At TLScontact, I research users across 10 visa centres and turn varied cultural, behavioral, and operational needs into a coherent biometric self-service experience. The work spans journey design, accessibility, prototypes, visual direction, and alignment across business and delivery teams. My earlier enterprise and fintech roles add experience with complex dashboards, analytics, and high-confidence transaction flows.",
        "close": "I would value the chance to help dnata connect customer experience, operational clarity, and scalable design standards across travel and air-service journeys used by diverse audiences.",
    },
    {
        "slug": "McDermott",
        "company": "McDermott",
        "recipient": "recruiting.ksa@mcdermott.com",
        "why": "McDermott's end-to-end engineering and project-delivery environment presents the kind of design challenge where I add the most value: making complex technical information and workflows understandable without simplifying away critical operational detail.",
        "match": "For more than two years at FORVIA, I worked inside Palantir Foundry, auditing and redesigning data applications used for technical and operational decision-making. I developed reusable patterns and guidance for designers and developers, and partnered with stakeholders to move from ambiguous requirements toward buildable interfaces. My current role adds international research, accessibility, and executive communication.",
        "close": "I would welcome a conversation about how product design, information architecture, and design systems could support McDermott's digital engineering, project, and operational platforms in Saudi Arabia.",
    },
    {
        "slug": "NESR",
        "company": "National Energy Services Reunited (NESR)",
        "recipient": "careers@nesr.com",
        "why": "NESR's regional focus, Saudi-based research and innovation activity, and emphasis on turning technology into practical operational value strongly align with my experience designing data products for complex industrial contexts.",
        "match": "At FORVIA, I improved Palantir Foundry applications that supported data exploration and decision-making, while building a design system for consistency across dense interfaces. I also facilitated a research and development ideation workshop in Paris-Nanterre, guiding teams from problem framing toward practical experience concepts. This combination helps me work between domain experts, data, engineering, and end users.",
        "close": "I would be keen to support NESR's digital and operational-intelligence initiatives by creating interfaces that help specialists move from complex information to confident action.",
    },
    {
        "slug": "KBR",
        "company": "KBR-AMCDE",
        "recipient": "kbr-amcdehr@kbr.com",
        "why": "KBR's work across digital engineering, data analytics, digital twins, AI, and enterprise technology is closely connected to the strongest part of my product-design experience: shortening the distance between complex data and a clear decision.",
        "match": "At FORVIA, I redesigned Palantir Foundry dashboards and workflows, established reusable design-system patterns, and collaborated with technical teams on information-heavy tools. At TLScontact, I now lead research and interaction design for an international biometric kiosk, balancing user confidence, accessibility, operational constraints, and implementation detail.",
        "close": "I would welcome the opportunity to bring user-centered design, systems thinking, and interface craft to KBR's digital engineering and mission-critical technology work in Saudi Arabia.",
    },
    {
        "slug": "Shawarmer",
        "company": "Shawarmer",
        "recipient": "career@shawarmer.com",
        "why": "Shawarmer stands out because the product experience is inseparable from the brand: more than 150 stores, online ordering, pickup and delivery, a loyalty program, and a playful identity all need to feel like one coherent customer journey.",
        "match": "My background is unusually suited to that intersection. I bring end-to-end product design across research, journeys, prototyping, analytics, and design systems, while my independent Jay Studio practice adds art direction, visual storytelling, photography, film, and campaign thinking. I can therefore work on conversion and usability without flattening the personality that makes a consumer brand distinctive.",
        "close": "I would be excited to help Shawarmer improve ordering, loyalty, and service experiences while keeping the brand's energy and creativity visible in every digital touchpoint.",
    },
    {
        "slug": "Innosoft",
        "company": "Innosoft",
        "recipient": "careers@innosoft.sa",
        "why": "Innosoft's work across UX/UI, web and mobile products, custom software, data intelligence, and digital-service portals is a direct fit with my experience designing complex products for enterprise, public-service, financial, and automotive contexts.",
        "match": "I have led discovery, UX audits, journey mapping, prototyping, usability testing, and high-fidelity interface design across SaaS and fintech products. At FORVIA, I created scalable patterns for Palantir Foundry applications; at TLScontact, I now design an international, multilingual self-service journey and align business, product, and delivery teams around a clear experience direction.",
        "close": "I would welcome the chance to contribute to Innosoft's client work by combining strong discovery, reusable systems, bilingual-market awareness, and polished interface execution from concept through delivery.",
    },
    {
        "slug": "Dr_Sulaiman_Al_Habib",
        "company": "Dr. Sulaiman Al Habib Medical Group",
        "recipient": "talent.acquisition@drsulaimanalhabib.com",
        "why": "The Group's investment in digital healthcare, telehealth, internal digitalization, and AI makes patient and staff experience a real product-design problem, not simply a visual-design exercise. That combination of trust, complexity, and service delivery is closely aligned with my current work.",
        "match": "At TLScontact, I lead UX/UI design for a biometric self-service experience used in a high-trust, time-sensitive environment. I combine research across international centres, accessibility, multilingual patterns, prototypes, and executive alignment. Earlier roles add experience with financial transactions, enterprise data applications, analytics, and design systems.",
        "close": "I would be motivated to help the Group make digital healthcare journeys clearer and more reassuring for patients while giving clinical and operational teams interfaces that support reliable decision-making.",
    },
    {
        "slug": "JHAH",
        "company": "Johns Hopkins Aramco Healthcare",
        "recipient": "careers@jhah.com",
        "why": "JHAH's connected patient journey across appointments, referrals, telehealth, MyChart services, specialty care, and its wider strategic transformation makes thoughtful service design essential. The opportunity to improve access and confidence across those touchpoints strongly appeals to me.",
        "match": "My current role at TLScontact involves designing an international biometric self-service experience where accessibility, clear guidance, cultural context, privacy, and operational handoffs all matter. I research users across 10 centres, translate findings into interaction models and prototypes, and align product, business, and delivery stakeholders around a coherent service direction.",
        "close": "I would welcome the opportunity to apply that experience to JHAH's patient-facing and internal digital services, helping people navigate important healthcare journeys with greater clarity, trust, and control.",
    },
]


def header_footer(canvas, doc, company: str) -> None:
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(PALE)
    canvas.setLineWidth(0.6)
    canvas.line(20 * mm, 14 * mm, width - 20 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(BODY_FONT, 7.2)
    canvas.drawString(20 * mm, 9.5 * mm, f"HAMDI JAWHER  /  OPEN APPLICATION  /  {company.upper()}")
    canvas.drawRightString(width - 20 * mm, 9.5 * mm, "21 AUGUST 2026")
    canvas.restoreState()


def build_letter(target: dict[str, str]) -> Path:
    path = OUTPUT_DIR / f"Hamdi_Jawher_Cover_Letter_{target['slug']}.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=17 * mm,
        bottomMargin=20 * mm,
        title=f"Open Application - Product Designer - {target['company']}",
        author="Hamdi Jawher",
        subject=f"Open application to {target['company']}",
    )

    story = [
        Paragraph("HAMDI JAWHER", STYLES["name"]),
        Paragraph("PRODUCT DESIGNER", STYLES["role"]),
    ]
    contact = Table(
        [[
            Paragraph("Tunis, Tunisia", STYLES["contact"]),
            Paragraph("+216 22 085 367", STYLES["contact"]),
            Paragraph('<link href="mailto:hamdijawher@icloud.com" color="#667181">hamdijawher@icloud.com</link>', STYLES["contact"]),
            Paragraph('<link href="https://www.jawherhamdi.com/" color="#667181">jawherhamdi.com</link>', STYLES["contact"]),
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
    story.extend([contact, Spacer(1, 9 * mm)])

    rule = Table([[""]], colWidths=[170 * mm], rowHeights=[0.8 * mm])
    rule.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), BLUE)]))
    story.extend([
        rule,
        Spacer(1, 8 * mm),
        Paragraph(f"OPEN APPLICATION  /  {target['company'].upper()}", STYLES["eyebrow"]),
        Paragraph("Product Designer", STYLES["title"]),
        Paragraph(f"Dear {target['company']} Hiring Team,", STYLES["body"]),
        Paragraph(
            f"I am writing to be considered for current or future Product Designer opportunities at {target['company']}. {target['why']}",
            STYLES["body"],
        ),
        Paragraph(target["match"], STYLES["body"]),
        Paragraph(
            "Across these roles, I have learned to move from research and ambiguous requirements to buildable flows, high-fidelity interfaces, reusable systems, and clear stakeholder decisions. My independent art-direction and creative-production practice adds visual judgment, helping me carry a coherent idea through interface detail, presentations, brand touchpoints, and final execution.",
            STYLES["body"],
        ),
        Paragraph(target["close"], STYLES["body"]),
        Paragraph(
            'I am based in Tunis and open to relocating to Saudi Arabia. My resume is attached, and selected work is available at <link href="https://www.jawherhamdi.com/" color="#1E65A8"><u>www.jawherhamdi.com</u></link>.',
            STYLES["body"],
        ),
        Paragraph("Thank you for your consideration.", STYLES["body"]),
        Spacer(1, 2 * mm),
        Paragraph("Hamdi Jawher", STYLES["signature"]),
        Paragraph("Product Designer", STYLES["contact"]),
    ])

    doc.build(
        story,
        onFirstPage=lambda canvas, document: header_footer(canvas, document, target["company"]),
        onLaterPages=lambda canvas, document: header_footer(canvas, document, target["company"]),
    )
    return path


def main() -> None:
    for target in TARGETS:
        print(build_letter(target))


if __name__ == "__main__":
    main()
