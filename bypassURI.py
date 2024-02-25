import requests
import time
import json

# Azure AD application details
client_id = '5d62298a-1bfd-4c7b-9d54-ae36db61db15'
client_secret = 'dPO8Q~R.eM0pWIlGqHQhqIP2ACjMukfSMvDKvaiB'

scopes = ['openid', 'profile', 'offline_access', 'Mail.Read']

# Microsoft endpoints
device_authorization_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/devicecode'
token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
inbox_url = 'https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages'

# Step 1: Request device code
device_code_response = requests.post(device_authorization_url, data={
    'client_id': client_id,
    'scope': ' '.join(scopes)
}).json()

print("Please visit {} and enter code {} to authenticate.".format(
    device_code_response['verification_uri'], device_code_response['user_code']))

# Step 2: Poll token endpoint for access token
while True:
    token_response = requests.post(token_url, data={
        'grant_type': 'urn:ietf:params:oauth:grant-type:device_code',
        'client_id': client_id,
        'client_secret': client_secret,  # Add the client_secret parameter
        'device_code': device_code_response['device_code']
    }).json()

    if 'error' in token_response:
        if token_response['error'] == 'authorization_pending':
            print("Waiting for user authorization...")
            time.sleep(device_code_response['interval'])
        elif token_response['error'] == 'expired_token':
            print("Token expired. Please try again.")
            break
        else:
            print("Error: {}".format(token_response['error_description']))
            break
    else:
        access_token = token_response['access_token']
        print("Access token:", access_token)

        # Step 3: Use access token to read most recent email in the inbox
        headers = {
            'Authorization': 'Bearer ' + access_token
        }

        inbox_response = requests.get(inbox_url + '?$orderby=receivedDateTime desc&$top=1', headers=headers)

        if inbox_response.status_code == 200:
            inbox_messages = inbox_response.json()
            if inbox_messages['value']:
                # Extract the body of the most recent email
                email_body = inbox_messages['value'][0].get('body', {}).get('content')
                if email_body:
                    # Store the email body in a .txt file
                    with open('email_body.txt', 'w', encoding='utf-8') as file:
                        file.write(email_body)
                    print("Email body saved to email_body.txt")
                else:
                    print("No email body found in the most recent email.")
            else:
                print("No emails found in the inbox.")
        else:
            print("Error retrieving inbox messages:", inbox_response.status_code)

        break  # Exit the while loop after successfully obtaining and processing the access token
