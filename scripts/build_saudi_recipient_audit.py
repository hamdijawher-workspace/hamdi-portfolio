from __future__ import annotations

import csv
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CAMPAIGN = ROOT / "output" / "saudi-open-applications" / "2026-08-21"
RAW = CAMPAIGN / "recipients_raw.txt"


COMPANIES = [
    "Arabian Fal", "Al-Dawaa Medical Services", "QRM / unknown", "Al-Ojaimi",
    "Rawabi Holding", "Unknown", "dnata", "Alesayi Motors", "Al Arayan",
    "McDermott", "AYTB", "GTE Corp", "NESR", "Farm Superstores",
    "Al Humam Law", "Gulf Tek Saudi", "CATCO Saudi", "Tafear", "SRACO",
    "SIDCO", "ATCO", "Yokogawa Saudi Arabia", "Shade Corporation", "Al Kafaa",
    "KBR-AMCDE", "Batook", "Shawarmer", "Archirodon", "Bin Ajinah",
    "Nesma", "Abdulla Fouad", "Innosoft", "Startime", "Musk", "Unknown",
    "SAB KSA", "Bonyan", "Innovest", "Bonyan", "National Housing Company",
    "Artar", "Dar Wa Emaar", "Al Masah", "Unknown", "Unknown legal recruiter",
    "Almoosa Health", "Almoosa Health", "Saudi German Health", "Saudi German Health",
    "Dr. Sulaiman Al Habib Medical Group", "Johns Hopkins Aramco Healthcare",
    "Al Ahsa Hospital", "Al Mana General Hospitals", "Family Care Hospital",
    "Ram Clinics", "Dr. Soliman Fakeeh Hospital", "Mouwasat Medical Services",
    "Dallah Hospital", "Dr. Sulaiman Al Habib Medical Group", "Al Murjan Hospital",
    "Unknown", "We Care KSA",
]


CORRECTIONS = {
    "recruiting.ksa@mcmermott.com": (
        "recruiting.ksa@mcdermott.com",
        "The pasted domain is misspelled. The corrected mcdermott.com domain has active mail routing.",
    ),
}

DEAD_DOMAIN_GUIDANCE = {
    "alesayi_motors.com": "Malformed domain with an underscore. Use the official Alesayi careers portal instead: https://careers.alesayi.com/",
    "alarayan.com": "No DNS or mail routing found; do not send until a current official contact is verified.",
    "alhumamlaw.com": "No DNS or mail routing found; do not send until a current official contact is verified.",
    "gulfteksaudi.com": "No DNS or mail routing found; do not send until a current official contact is verified.",
    "startime.com.sa": "No DNS or mail routing found; do not send until a current official contact is verified.",
    "almasah.net": "No DNS or mail routing found; do not send until a current official contact is verified.",
}

PERSONAL_PROVIDERS = {"gmail.com", "hotmail.com"}
REVIEW_LOCALPARTS = {
    "info", "marketing.np", "catcosa", "m", "j",
    "al.alshaikh", "ymohammed", "s.alwadi", "i.atassi", "oalkhunaizi",
}

HEALTHCARE = {
    "Al-Dawaa Medical Services", "Almoosa Health", "Saudi German Health",
    "Dr. Sulaiman Al Habib Medical Group", "Johns Hopkins Aramco Healthcare",
    "Al Ahsa Hospital", "Al Mana General Hospitals", "Dr. Soliman Fakeeh Hospital",
    "Mouwasat Medical Services", "Dallah Hospital", "Al Murjan Hospital", "We Care KSA",
}
CONSUMER_SERVICE = {"dnata", "Farm Superstores", "Batook", "Shawarmer"}
TECHNOLOGY = {"Innosoft"}


def mailbox_priority(email: str) -> int:
    local = email.split("@", 1)[0]
    if "talent.acquisition" in local:
        return 100
    if "recruitment" in local or "recruiting" in local:
        return 95
    if "careers" in local or "career" in local:
        return 90
    if "hr" in local:
        return 85
    if "cv" in local:
        return 80
    if local in {"jobs", "job", "rec", "recruit"}:
        return 75
    if "wadaef" in local:
        return 70
    return 0


def application_body(company: str) -> str:
    if company in HEALTHCARE:
        relevance = "Your healthcare environment is especially relevant to my current work on accessible, multilingual, high-trust self-service experiences."
    elif company in CONSUMER_SERVICE:
        relevance = "Your customer-facing environment is especially relevant to my mix of product design, service design, visual systems, and art direction."
    elif company in TECHNOLOGY:
        relevance = "Your digital-product environment is especially relevant to my experience across data-heavy products, design systems, and end-to-end discovery."
    else:
        relevance = "Your operational and technical environment is especially relevant to my work simplifying complex enterprise workflows at FORVIA and TLScontact."

    return f"""Dear {company} Hiring Team,

I am reaching out to be considered for current or future Senior Product Designer / UX/UI Designer opportunities at {company}. {relevance}

I bring more than five years of experience across complex digital products and services. At TLScontact, I lead UX/UI design for a next-generation biometric self-service experience. Previously at FORVIA, I redesigned data-heavy Palantir Foundry applications and built reusable design-system patterns. At Addinn Group, I worked across fintech and SaaS products using research, usability testing, analytics, and A/B evidence.

My background in art direction and creative production adds strong visual judgment to my product work, helping me connect strategy, systems, interface craft, and final execution.

I am based in Tunis and open to relocating to Saudi Arabia. I have attached my resume and cover letter, and my portfolio is available here: https://www.jawherhamdi.com/

Thank you for your time. I would welcome a conversation if my experience could fit a current or upcoming need.

Best regards,

Hamdi Jawher
Senior Product Designer / UX/UI Designer
+216 22 085 367
hamdijawher@icloud.com
https://www.jawherhamdi.com/"""


def has_mail_routing(domain: str) -> bool:
    mx = subprocess.run(
        ["dig", "+time=2", "+tries=1", "+short", "MX", domain],
        capture_output=True,
        text=True,
        check=False,
    ).stdout.strip()
    if mx:
        return True
    address = subprocess.run(
        ["dig", "+time=2", "+tries=1", "+short", "A", domain],
        capture_output=True,
        text=True,
        check=False,
    ).stdout.strip()
    return bool(address)


def classify(email: str, seen: set[str]) -> tuple[str, str, str]:
    normalized = email.strip().lower()
    local, domain = normalized.rsplit("@", 1)

    if normalized in seen:
        return "DUPLICATE", normalized, "Duplicate of an earlier Bonyan recipient; create only one message."
    seen.add(normalized)

    if normalized in CORRECTIONS:
        corrected, note = CORRECTIONS[normalized]
        return "CORRECTED - REVIEW", corrected, note

    if domain in DEAD_DOMAIN_GUIDANCE:
        return "DO NOT SEND", normalized, DEAD_DOMAIN_GUIDANCE[domain]

    if "_" in domain or not has_mail_routing(domain):
        return "DO NOT SEND", normalized, "The domain has no usable mail routing or is malformed."

    if domain in PERSONAL_PROVIDERS:
        return "HOLD - VERIFY OWNER", normalized, "Personal/free mailbox from an unverified reposted list; identity and authority are unknown."

    if local in REVIEW_LOCALPARTS or local.startswith("info") or local.startswith("marketing"):
        return "HOLD - VERIFY PURPOSE", normalized, "The domain is active, but this is generic, marketing, one-letter, or person-specific rather than a confirmed recruitment inbox."

    if local in {"rec", "job", "jobs", "recruit"} or any(token in local for token in ("career", "recruit", "talent", "hr", "cv", "wadaef")):
        return "SEND-READY AFTER CONFIRMATION", normalized, "Corporate domain has active mail routing and the inbox name is recruitment-oriented; individual mailbox existence is still not guaranteed."

    return "HOLD - VERIFY PURPOSE", normalized, "Corporate domain is active, but the mailbox purpose is not clearly recruitment-related."


def main() -> None:
    emails = [line.strip() for line in RAW.read_text(encoding="utf-8").splitlines() if line.strip()]
    if len(emails) != len(COMPANIES):
        raise ValueError(f"Expected {len(COMPANIES)} companies, found {len(emails)} emails")

    rows = []
    seen: set[str] = set()
    for index, (company, source_email) in enumerate(zip(COMPANIES, emails), 1):
        status, destination, note = classify(source_email, seen)
        rows.append({
            "source_number": index,
            "company": company,
            "source_email": source_email,
            "recommended_destination": destination,
            "status": status,
            "note": note,
        })

    csv_path = CAMPAIGN / "recipient_audit.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    counts = {}
    for row in rows:
        counts[row["status"]] = counts.get(row["status"], 0) + 1

    report = [
        "# Saudi open-application recipient audit",
        "",
        "Generated 21 August 2026. This audit checks duplicate entries, address syntax, and current domain mail routing. It does not prove that any individual mailbox still exists or belongs to HR.",
        "",
        "## Result",
        "",
    ]
    for status, count in sorted(counts.items()):
        report.append(f"- {status}: {count}")
    report.extend([
        "",
        "## Hard truth",
        "",
        "The list is a recycled social-media list, not a verified employer directory. Sending every line exactly as pasted would include a duplicate, malformed or dead domains, personal Gmail/Hotmail addresses, named employees whose current role is unknown, and inboxes aimed at marketing or general information. Use only the send-ready group first, one message per company, and stop the batch if bounces rise.",
        "",
        "## Full audit",
        "",
        "| # | Company | Source email | Recommended destination | Status | Note |",
        "|---:|---|---|---|---|---|",
    ])
    for row in rows:
        report.append(
            f"| {row['source_number']} | {row['company']} | {row['source_email']} | {row['recommended_destination']} | {row['status']} | {row['note']} |"
        )
    (CAMPAIGN / "RECIPIENT_AUDIT.md").write_text("\n".join(report) + "\n", encoding="utf-8")

    eligible = [
        row for row in rows
        if row["status"] in {"SEND-READY AFTER CONFIRMATION", "CORRECTED - REVIEW"}
    ]
    by_company = {}
    for row in eligible:
        current = by_company.get(row["company"])
        if current is None or mailbox_priority(row["recommended_destination"]) > mailbox_priority(current["recommended_destination"]):
            by_company[row["company"]] = row

    wave_path = CAMPAIGN / "recommended_individual_send_wave.csv"
    with wave_path.open("w", newline="", encoding="utf-8") as handle:
        fieldnames = ["company", "to", "subject", "body", "attachments", "source_status"]
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for company, row in by_company.items():
            writer.writerow({
                "company": company,
                "to": row["recommended_destination"],
                "subject": "Open Application - Senior Product Designer / UX/UI Designer - Hamdi Jawher",
                "body": application_body(company),
                "attachments": "Hamdi_Jawher Resume.pdf; Hamdi_Jawher_Open_Application_Cover_Letter_Saudi_Arabia.pdf",
                "source_status": row["status"],
            })

    print(csv_path)
    print(CAMPAIGN / "RECIPIENT_AUDIT.md")
    print(wave_path)
    print(f"recommended unique company messages: {len(by_company)}")
    print(counts)


if __name__ == "__main__":
    main()
