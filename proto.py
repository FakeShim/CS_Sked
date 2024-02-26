import imaplib
import email
from email.header import decode_header

# IMAP settings
imap_server = 'imap.gmail.com'
username = 'csschedule01@gmail.com'
password = 'gjrj aktj qewf iclo '

# Connect to the IMAP server
mail = imaplib.IMAP4_SSL(imap_server)
mail.login(username, password)
mail.select("inbox")

# Search for the latest email
status, data = mail.search(None, "ALL")
if status == "OK":
    latest_email_id = data[0].split()[-1]
    status, data = mail.fetch(latest_email_id, "(RFC822)")
    if status == "OK":
        raw_email = data[0][1]
        email_message = email.message_from_bytes(raw_email)
        
        # Extracting subject
        subject = decode_header(email_message["Subject"])[0][0]
        if isinstance(subject, bytes):
            subject = subject.decode()
        print("Subject:", subject)
        
        # Extracting sender
        sender = email.utils.parseaddr(email_message['From'])[1]
        print("Sender:", sender)
        
        # Extracting email body
        if email_message.is_multipart():
            for part in email_message.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))
                if "attachment" not in content_disposition:
                    payload = part.get_payload(decode=True)
                    if payload is not None:
                        body = payload.decode()
                        print("Body:", body)
        else:
            payload = email_message.get_payload(decode=True)
            if payload is not None:
                body = payload.decode()
                print("Body:", body)
            

# Logout and close connection
mail.logout()
