from __future__ import annotations

from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm

import build_saudi_first_wave_tailored_letters as base


ROOT = Path(__file__).resolve().parents[1]
base.OUTPUT_DIR = ROOT / "output" / "pdf" / "saudi-third-wave"
base.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def current_header_footer(canvas, doc, company: str) -> None:
    canvas.saveState()
    width, _ = A4
    canvas.setStrokeColor(base.PALE)
    canvas.setLineWidth(0.6)
    canvas.line(20 * mm, 14 * mm, width - 20 * mm, 14 * mm)
    canvas.setFillColor(base.MUTED)
    canvas.setFont(base.BODY_FONT, 7.2)
    canvas.drawString(20 * mm, 9.5 * mm, f"HAMDI JAWHER  /  OPEN APPLICATION  /  {company.upper()}")
    canvas.drawRightString(width - 20 * mm, 9.5 * mm, "22 AUGUST 2026")
    canvas.restoreState()


base.header_footer = current_header_footer


TARGETS = [
    {
        "slug": "SHADE_Corporation",
        "company": "SHADE Corporation",
        "recipient": "careers@shadeco.com",
        "why": "SHADE's work across engineering, procurement, construction, project management, operations, maintenance, and infrastructure creates a strong need for digital products that make complex project information and workflows easier to understand and act on.",
        "match": "At FORVIA, I redesigned data-heavy Palantir Foundry applications used in complex operational environments, translating ambiguous requirements into clearer dashboards, workflows, and reusable design-system patterns. My current TLScontact work adds international research, accessibility, multilingual interaction design, and alignment across business and delivery teams.",
        "close": "I would welcome the opportunity to support SHADE's project and operational teams with focused internal platforms, dashboards, workflow tools, and scalable design standards that improve clarity without losing technical rigor.",
    },
    {
        "slug": "Batook",
        "company": "Batook",
        "recipient": "recruitment@batook.com",
        "why": "Batook's portfolio of established consumer brands, extensive product range, regional expansion, and focus on innovation create a compelling opportunity to connect brand expression with useful digital customer and commercial experiences.",
        "match": "My background combines end-to-end product design with art direction and creative production. I have designed complex self-service, fintech, SaaS, and enterprise products using research, journey mapping, prototyping, analytics, usability testing, and design systems, while my independent Jay Studio practice adds brand strategy, visual storytelling, photography, film, and campaign thinking.",
        "close": "I would be excited to help Batook improve consumer, retail, brand, and internal digital touchpoints while keeping the energy and distinctiveness of its product portfolio visible throughout the experience.",
    },
]


def main() -> None:
    for target in TARGETS:
        print(base.build_letter(target))


if __name__ == "__main__":
    main()
