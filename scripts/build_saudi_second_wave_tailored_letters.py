from __future__ import annotations

from pathlib import Path

import build_saudi_first_wave_tailored_letters as base


ROOT = Path(__file__).resolve().parents[1]
base.OUTPUT_DIR = ROOT / "output" / "pdf" / "saudi-second-wave"
base.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


TARGETS = [
    {
        "slug": "Arabian_Fal",
        "company": "Arabian Fal",
        "recipient": "cv@arabianfal.com",
        "why": "Arabian Fal's scale across facilities, maintenance, industrial services, and its dedicated digitalization and technology initiative creates a meaningful opportunity for product design to make operational information and service workflows clearer across teams and locations.",
        "match": "At FORVIA, I redesigned data-heavy Palantir Foundry applications used in complex operational environments, turning dense workflows into clearer dashboards and reusable design-system patterns. My current work at TLScontact adds international research, accessibility, multilingual interaction design, and alignment across business and delivery teams.",
        "close": "I would welcome the opportunity to help Arabian Fal turn operational knowledge, data, and service processes into focused digital tools that support faster understanding and more consistent execution.",
    },
    {
        "slug": "AYTB",
        "company": "AYTB",
        "recipient": "recruitment@aytb.com",
        "why": "AYTB's work across industrial contracting, manufacturing, operations, maintenance, and facility services is exactly the kind of complex environment where thoughtful product design can connect people, processes, and technical information.",
        "match": "At FORVIA, I worked closely with technical teams and stakeholders to redesign Palantir Foundry applications for operational decision-making. I translated ambiguous requirements into buildable flows, established reusable interface patterns, and made complex states and data easier to understand without removing essential detail.",
        "close": "I would be excited to support AYTB's operational excellence and innovation goals through clear internal platforms, service workflows, dashboards, and scalable design standards.",
    },
    {
        "slug": "SRACO",
        "company": "SRACO",
        "recipient": "recruitment@sraco.com.sa",
        "why": "SRACO's combination of facility management, engineering, workforce services, and IT and digital solutions presents a strong service-design opportunity across customer, employee, and operational touchpoints.",
        "match": "My experience spans international self-service journeys at TLScontact, enterprise data products at FORVIA, and fintech and SaaS platforms at Addinn Group. Across these roles, I have used research, journey mapping, prototyping, usability testing, analytics, and design systems to turn operational complexity into practical digital experiences.",
        "close": "I would welcome the chance to help SRACO create clearer digital services for clients and teams, from service requests and workforce tools to performance dashboards and connected facility-management experiences.",
    },
    {
        "slug": "ALKAFAA",
        "company": "ALKAFAA",
        "recipient": "klc.hr@alkafaa.com",
        "why": "ALKAFAA's broad industrial product range, technical documentation, inventory, inspection, and logistics network creates important digital journeys for customers and internal teams who need to find, compare, validate, and move complex materials efficiently.",
        "match": "At FORVIA, I redesigned information-heavy applications and created reusable patterns that helped users navigate complex data with greater clarity. My earlier SaaS and fintech work strengthened my ability to structure search, transactions, dashboards, and evidence-based improvements across demanding workflows.",
        "close": "I would be interested in helping ALKAFAA improve digital catalogs, technical-information tools, customer journeys, inventory visibility, and operational interfaces while preserving the precision required by industrial supply.",
    },
    {
        "slug": "Yokogawa_Saudi_Arabia",
        "company": "Yokogawa Saudi Arabia",
        "recipient": "hrdepartmental@sa.yokogawa.com",
        "why": "Yokogawa's work in industrial automation, digital transformation, OT-IT integration, analytics, and the move toward industrial autonomy closely matches the strongest part of my product-design experience: making complex systems and data useful for human decisions.",
        "match": "For more than two years at FORVIA, I redesigned Palantir Foundry dashboards and workflows, built reusable design-system patterns, and collaborated with technical teams on information-heavy tools. At TLScontact, I now lead an international biometric self-service experience where clarity, accessibility, confidence, and operational reliability are essential.",
        "close": "I would welcome the opportunity to contribute user-centered design and systems thinking to Yokogawa's industrial digital products, helping connect advanced technology with clear, reliable experiences for operators, specialists, and enterprise teams.",
    },
]


def main() -> None:
    for target in TARGETS:
        print(base.build_letter(target))


if __name__ == "__main__":
    main()
