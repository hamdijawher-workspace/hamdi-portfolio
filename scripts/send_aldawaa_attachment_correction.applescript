property resumePath : "/Users/mac/Documents/Hamdi_Jawher Resume.pdf"
property letterPath : "/Users/mac/Documents/hamdi-portfolio-main/output/pdf/saudi-first-wave/Hamdi_Jawher_Cover_Letter_Al_Dawaa.pdf"
property senderAddress : "hamdijawher@icloud.com"

log "CORRECTION_GAP 0/2"
repeat with minutePart from 1 to 2
    delay 60
    log "CORRECTION_GAP " & minutePart & "/2"
end repeat

set subjectLine to "Updated Application Materials | Product Designer | Al-Dawaa Medical Services | Hamdi Jawher"
set bodyText to "Dear Al-Dawaa Medical Services Talent Acquisition Team," & return & return & ¬
    "Please accept this brief follow-up to my earlier open application. I am attaching the resume and Product Designer cover letter that should accompany my application." & return & return & ¬
    "Al-Dawaa's connected pharmacy, e-commerce, delivery, prescription, and consultation services are especially relevant to my experience designing accessible, high-trust digital journeys. Across TLScontact, FORVIA, and Addinn Group, I have worked on complex self-service, enterprise, fintech, and SaaS products using research, prototyping, design systems, usability testing, analytics, and strong interface craft." & return & return & ¬
    "I am based in Tunis and open to relocating to Saudi Arabia. Selected work is available at https://www.jawherhamdi.com/." & return & return & ¬
    "Thank you for considering my application, and apologies for the additional email." & return & return & ¬
    "Best regards," & return & return & ¬
    "Hamdi Jawher" & return & ¬
    "Product Designer" & return & ¬
    "+216 22 085 367" & return & ¬
    "hamdijawher@icloud.com" & return & ¬
    "https://www.jawherhamdi.com/"

tell application "Mail"
    set outgoingMessage to make new outgoing message with properties {subject:subjectLine, content:bodyText & return & return, visible:false}
    tell outgoingMessage
        set sender to senderAddress
        make new to recipient at end of to recipients with properties {address:"cv@aldawaa.com.sa"}
        make new attachment with properties {file name:(POSIX file resumePath as alias)} at after the last paragraph
        make new attachment with properties {file name:(POSIX file letterPath as alias)} at after the last paragraph
    end tell
    delay 4
    set sendResult to send outgoingMessage
end tell

if sendResult is not true then error "Mail did not confirm the Al-Dawaa correction send"
log "CORRECTION_SENT | Al-Dawaa Medical Services | cv@aldawaa.com.sa"
