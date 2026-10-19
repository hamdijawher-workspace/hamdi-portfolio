property resumePath : "/Users/mac/Documents/Hamdi_Jawher Resume.pdf"
property letterRoot : "/Users/mac/Documents/hamdi-portfolio-main/output/pdf/saudi-first-wave/"
property senderAddress : "hamdijawher@icloud.com"

set campaignItems to {¬
    {"Al-Dawaa Medical Services", "cv@aldawaa.com.sa", "Hamdi_Jawher_Cover_Letter_Al_Dawaa.pdf", "Al-Dawaa's connected pharmacy, e-commerce, delivery, prescription, and consultation services are especially relevant to my experience designing accessible, high-trust digital journeys."}, ¬
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

repeat with itemIndex from 1 to count of campaignItems
    set campaignItem to item itemIndex of campaignItems
    set companyName to item 1 of campaignItem
    set recipientAddress to item 2 of campaignItem
    set letterFilename to item 3 of campaignItem
    set relevanceSentence to item 4 of campaignItem
    set subjectLine to "Open Application - Senior Product Designer / UX/UI - " & companyName & " - Hamdi Jawher"
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

        delay 3
        if (count of mail attachments of outgoingMessage) is not 2 then error "Attachment check failed for " & companyName
        send outgoingMessage
    end tell

    log "SENT " & itemIndex & "/10 | " & companyName & " | " & recipientAddress

    if itemIndex is less than count of campaignItems then
        repeat with minutePart from 1 to 2
            delay 60
            log "GAP " & minutePart & "/2 after " & companyName
        end repeat
    end if
end repeat

log "CAMPAIGN_COMPLETE 10/10"


on buildBody(companyName, relevanceSentence)
    return "Dear " & companyName & " Hiring Team," & return & return & ¬
        "I am reaching out to be considered for current or future Senior Product Designer / UX/UI Designer opportunities at " & companyName & ". " & relevanceSentence & return & return & ¬
        "I bring more than five years of experience across complex digital products and services. At TLScontact, I lead UX/UI design for a next-generation biometric self-service experience. Previously at FORVIA, I redesigned data-heavy Palantir Foundry applications and built reusable design-system patterns. At Addinn Group, I worked across fintech and SaaS products using research, usability testing, analytics, and A/B evidence." & return & return & ¬
        "My background in art direction and creative production adds strong visual judgment to my product work, helping me connect strategy, systems, interface craft, and final execution." & return & return & ¬
        "I am based in Tunis and open to relocating to Saudi Arabia. I have attached my resume and a cover letter tailored to " & companyName & ". My portfolio is available here: https://www.jawherhamdi.com/" & return & return & ¬
        "Thank you for your time. I would welcome a conversation if my experience could fit a current or upcoming need." & return & return & ¬
        "Best regards," & return & return & ¬
        "Hamdi Jawher" & return & ¬
        "Senior Product Designer / UX/UI Designer" & return & ¬
        "+216 22 085 367" & return & ¬
        "hamdijawher@icloud.com" & return & ¬
        "https://www.jawherhamdi.com/"
end buildBody
