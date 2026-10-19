property resumePath : "/Users/mac/Documents/Hamdi_Jawher Resume.pdf"
property letterRoot : "/Users/mac/Documents/hamdi-portfolio-main/output/pdf/saudi-first-wave/"
property senderAddress : "hamdijawher@icloud.com"

set campaignItems to {¬
    {"Rawabi Holding", "recruitment@rawabiholding.com", "Hamdi_Jawher_Cover_Letter_Rawabi_Holding.pdf", "Rawabi's focus on next-generation technology and operational excellence across energy and industrial services strongly matches my experience simplifying complex enterprise workflows."}, ¬
    {"dnata", "careers@dnata.com", "Hamdi_Jawher_Cover_Letter_dnata.pdf", "dnata's global service footprint and focus on consistent customer experiences are especially relevant to my international service-design background."}, ¬
    {"McDermott", "recruiting.ksa@mcdermott.com", "Hamdi_Jawher_Cover_Letter_McDermott.pdf", "McDermott's complex engineering and project-delivery environment is a strong match for my experience turning technical workflows and dense operational information into usable digital products."}, ¬
    {"National Energy Services Reunited (NESR)", "careers@nesr.com", "Hamdi_Jawher_Cover_Letter_NESR.pdf", "NESR's Saudi-based research, technology, and operational-intelligence focus aligns closely with my experience designing data products for complex industrial contexts."}, ¬
    {"KBR-AMCDE", "kbr-amcdehr@kbr.com", "Hamdi_Jawher_Cover_Letter_KBR.pdf", "KBR's work across digital engineering, data analytics, digital twins, and enterprise technology closely matches my experience shortening the distance between complex data and clear decisions."}, ¬
    {"Shawarmer", "career@shawarmer.com", "Hamdi_Jawher_Cover_Letter_Shawarmer.pdf", "Shawarmer's combination of brand, ordering, delivery, loyalty, and a large physical footprint is especially relevant to my mix of product design and art direction."}, ¬
    {"Innosoft", "careers@innosoft.sa", "Hamdi_Jawher_Cover_Letter_Innosoft.pdf", "Innosoft's work across UX/UI, web and mobile products, digital-service portals, and data intelligence is a direct fit with my enterprise and public-service design experience."}, ¬
    {"Dr. Sulaiman Al Habib Medical Group", "talent.acquisition@drsulaimanalhabib.com", "Hamdi_Jawher_Cover_Letter_Dr_Sulaiman_Al_Habib.pdf", "The Group's investment in digital healthcare, telehealth, and AI is closely aligned with my experience designing accessible, high-trust self-service journeys."}, ¬
    {"Johns Hopkins Aramco Healthcare", "careers@jhah.com", "Hamdi_Jawher_Cover_Letter_JHAH.pdf", "JHAH's connected patient journey across appointments, referrals, telehealth, and MyChart services strongly connects with my international service-design experience."}¬
}

log "INITIAL_GAP 0/2"
repeat with minutePart from 1 to 2
    delay 60
    log "INITIAL_GAP " & minutePart & "/2"
end repeat

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
    log "SENT " & (itemIndex + 1) & "/10 | " & companyName & " | " & recipientAddress

    if itemIndex is less than count of campaignItems then
        repeat with minutePart from 1 to 2
            delay 60
            log "GAP " & minutePart & "/2 after " & companyName
        end repeat
    end if
end repeat

log "CAMPAIGN_COMPLETE 10/10"


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
