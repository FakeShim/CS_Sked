import requests

# Azure AD app (client) ID
client_id = '5d62298a-1bfd-4c7b-9d54-ae36db61db15'

# Azure AD app (client) secret
client_secret = 'dPO8Q~R.eM0pWIlGqHQhqIP2ACjMukfSMvDKvaiB'

# Azure AD tenant ID
tenant_id = '2a00728e-f0d0-40b4-a4e8-ce433f3fbca7'

# Microsoft Graph API endpoint
graph_api_endpoint = 'https://graph.microsoft.com/v1.0/users/37bee037-09ad-4537-b26f-ee93bf091390/mailfolders/inbox/messages'

# Construct the token endpoint URL
token_endpoint = f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token'

# OAuth 2.0 token request parameters
token_request_params = {
    'grant_type': 'client_credentials',
    'client_id': client_id,
    'client_secret': client_secret,
    'scope': 'https://graph.microsoft.com/.default'
}

# Make a POST request to obtain an access token
token_response = requests.post(token_endpoint, data=token_request_params)
token_response.raise_for_status()
access_token = token_response.json()['access_token']

# Request headers with access token
headers = {
    'Authorization': 'Bearer ' + access_token,
    'Content-Type': 'application/json'
}

# Make GET request to Microsoft Graph API
response = requests.get(graph_api_endpoint, headers=headers)
response.raise_for_status()

# Parse response JSON to extract email messages
inbox_messages = response.json()['value']

# Process each email message
for message in inbox_messages:
    print('Sender:', message['from']['emailAddress']['address'])
    print('Subject:', message['subject'])
    print('Body:', message['body']['content'])
    print('---')
