import requests

# Azure AD OAuth 2.0 token endpoint
token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
client_id = '5d62298a-1bfd-4c7b-9d54-ae36db61db15'  # Replace with your client ID
client_secret = 'dPO8Q~R.eM0pWIlGqHQhqIP2ACjMukfSMvDKvaiB'  # Replace with your client secret

# OAuth 2.0 token request parameters
token_payload = {
    'grant_type': 'client_credentials',
    'client_id': client_id,
    'client_secret': client_secret,
    'scope': 'https://graph.microsoft.com/.default'
}

# Make POST request to obtain an access token
token_response = requests.post(token_url, data=token_payload)

# Check if request was successful
if token_response.status_code == 200:
    access_token = token_response.json().get('access_token')
    # Microsoft Graph API endpoint targeting a specific user's mailbox
    user_id = '37bee037-09ad-4537-b26f-ee93bf091390'  # Replace with the target user's ID
    graph_api_endpoint = f'https://graph.microsoft.com/v1.0/users/{user_id}/mailfolders/inbox/messages'
    
    # Request headers
    headers = {
        'Authorization': 'Bearer {}'.format(access_token),
        'Content-Type': 'application/json'
    }
    
    # Make GET request to Microsoft Graph API
    response = requests.get(graph_api_endpoint, headers=headers)

    # Check if request was successful
    if response.status_code == 200:
        # Parse response JSON to extract email messages
        email_messages = response.json().get('value', [])
        
        # Process each email message
        for message in email_messages:
            print('Sender:', message.get('from', {}).get('emailAddress', {}).get('address'))
            print('Subject:', message.get('subject'))
            print('Body:', message.get('body', {}).get('content'))
            print('---')
    else:
        print('Error fetching email messages:', response.text)
else:
    print('Error fetching access token:', token_response.text)
