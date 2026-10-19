property resumePath : "/Users/mac/Documents/Hamdi_Jawher Resume.pdf"
property letterRoot : "/Users/mac/Documents/hamdi-portfolio-main/output/pdf/saudi-second-wave/"
property senderAddress : "hamdijawher@icloud.com"

set campaignItems to {¬
    {"Arabian Fal", "cv@arabianfal.com", "Hamdi_Jawher_Cover_Letter_Arabian_Fal.pdf", "Arabian Fal's scale across facilities, maintenance, industrial services, and its digitalization initiative strongly matches my experience simplifying complex operational workflows."}, ¬
    {"AYTB", "recruitment@aytb.com", "Hamdi_Jawher_Cover_Letter_AYTB.pdf", "AYTB's work across industrial contracting, manufacturing, operations, maintenance, and facility services is especially relevant to my experience designing clear products for technical environments."}, ¬
    {"SRACO", "recruitment@sraco.com.sa", "Hamdi_Jawher_Cover_Letter_SRACO.pdf", "SRACO's combination of facility management, engineering, workforce services, and digital solutions presents a strong opportunity to improve connected customer and operational experiences."}, ¬
    {"ALKAFAA", "klc.hr@alkafaa.com", "Hamdi_Jawher_Cover_Letter_ALKAFAA.pdf", "ALKAFAA's technical product range, documentation, inventory, inspection, and logistics network creates valuable digital journeys for customers and internal teams managing complex industrial materials."}, ¬
    {"Yokogawa Saudi Arabia", "hrdepartmental@sa.yokogawa.com", "Hamdi_Jawher_Cover_Letter_Yokogawa_Saudi_Arabia.pdf", "Yokogawa's work across industrial automation, digital transformation, OT-IT integration, analytics, and industrial autonomy closely matches my experience making complex systems and data useful for human decisions."}¬
}

repeat with itemIndex from 1 to count of campaignItems
    set campaignItem to item itemIndex of campaignItems
    set companyName to item 1 of campaignItem
    set recipientAddress to item 2 of campaignItem
    set letterFilename to item 3 of campaignItem
    set relevanceSentence to item 4 of campaignItem
    set subjectLine to "Open Application | Product Designer | " & companyName & " | Hamdi Jawher"
    set bodyText to my buildBody(companyName, relevanceSentence)
    set letterPath to letterRoot & letterFilename

    tell application "Mail"
        set outgoingMessage to make new outgoing message with properties {subject:subjectLine, content:bodyText & return & return, visible:false}
        tell outgoingMessage
            set sender to senderAddress
            make new to recipient at end of to recipients with properties {address:recipientAddress}
            make new attachment with properties {file name:(POSIX file resumePath as alias)} at after the last paragraph
            make new attachment with properties {file name:(POSIX file letterPath as alias)} at after the last paragraph
        end tell
        delay 4
        set sendResult to send outgoingMessage
    end tell

    if sendResult is not true then error "Mail did not confirm send for " & companyName
    log "SENT " & itemIndex & "/5 | " & companyName & " | " & recipientAddress

    if itemIndex is less than count of campaignItems then
        repeat with minutePart from 1 to 2
            delay 60
            log "GAP " & minutePart & "/2 after " & companyName
        end repeat
    end if
end repeat

log "SECOND_WAVE_COMPLETE 5/5"


on buildBody(companyName, relevanceSentence)
    return "Dear " & companyName & " Talent Acquisition Team," & return & return & ¬
        "I am reaching out to express my interest in current or future Product Designer opportunities at " & companyName & ". " & relevanceSentence & return & return & ¬
        "I bring more than five years of experience designing digital products and services in international, high-complexity environments. At TLScontact, I lead UX/UI design for a biometric self-service experience. Previously at FORVIA, I redesigned data-heavy Palantir Foundry applications and created reusable design-system patterns. My earlier fintech and SaaS work at Addinn Group was grounded in research, usability testing, analytics, and A/B evidence." & return & return & ¬
        "My strength is turning complex journeys and information into clear, useful products. I combine research, systems thinking, prototyping, interface craft, and art direction to connect user needs with business and operational goals." & return & return & ¬
        "I am based in Tunis and open to relocating to Saudi Arabia. I have attached my resume and a cover letter prepared specifically for " & companyName & ". You can view selected work at https://www.jawherhamdi.com/." & return & return & ¬
        "Thank you for considering my open application. I would be glad to discuss how my experience could support a current or upcoming product-design need at " & companyName & "." & return & return & ¬
        "Best regards," & return & return & ¬
        "Hamdi Jawher" & return & ¬
        "Product Designer" & return & ¬
        "+216 22 085 367" & return & ¬
        "hamdijawher@icloud.com" & return & ¬
        "https://www.jawherhamdi.com/"
end buildBody
