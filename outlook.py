
import requests

# Azure AD OAuth 2.0 token endpoint
token_endpoint = 'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token'

# Azure AD app (client) ID and client secret
client_id = '5d62298a-1bfd-4c7b-9d54-ae36db61db15'
client_secret = 'dPO8Q~R.eM0pWIlGqHQhqIP2ACjMukfSMvDKvaiB'

# Tenant ID (Directory ID)
tenant_id = '2a00728e-f0d0-40b4-a4e8-ce433f3fbca7'

# OAuth 2.0 token request parameters
token_request_params = {
    'grant_type': 'client_credentials',
    'client_id': client_id,
    'client_secret': client_secret,
    'scope': 'https://graph.microsoft.com/.default'
}

# Make a POST request to obtain an access token
token_response = requests.post(token_endpoint.format(tenant_id=tenant_id), data=token_request_params)

# Check if request was successful
if token_response.status_code == 200:
    access_token = token_response.json()['access_token']
    print('Access token:', access_token)
else:
    print('Error:', token_response.text)
