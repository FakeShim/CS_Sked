import requests

# Azure AD OAuth 2.0 token endpoint
token_endpoint = 'https://login.microsoftonline.com/2a00728e-f0d0-40b4-a4e8-ce433f3fbca7/oauth2/v2.0/token'

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
# if token_response.status_code == 200:
access_token = token_response.json()['access_token']
#     print('Access token:', access_token)
# else:
#     print('Error:', token_response.text)


import requests

# Microsoft Graph API endpoint
graph_api_endpoint = 'https://graph.microsoft.com/v1.0/users/37bee037-09ad-4537-b26f-ee93bf091390/mailfolders/inbox/messages'

# # Access token obtained from OAuth 2.0 authentication
# access_token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Im91dkFtRTJPY3JzUXlhSHMtc2VCMVo2aWlXMWltOGZvaldBbjdlQjlDV0EiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyIsImtpZCI6ImtXYmthYTZxczh3c1RuQndpaU5ZT2hIYm5BdyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yYTAwNzI4ZS1mMGQwLTQwYjQtYTRlOC1jZTQzM2YzZmJjYTcvIiwiaWF0IjoxNzA4NDYwNDI5LCJuYmYiOjE3MDg0NjA0MjksImV4cCI6MTcwODQ2NDMyOSwiYWlvIjoiRTJOZ1lMZ1NVdnFCODhVWjB3dVAxdld1czVOckJBQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJDUyBTa2VkIiwiYXBwaWQiOiI1ZDYyMjk4YS0xYmZkLTRjN2ItOWQ1NC1hZTM2ZGI2MWRiMTUiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yYTAwNzI4ZS1mMGQwLTQwYjQtYTRlOC1jZTQzM2YzZmJjYTcvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiIwOTIwYmM5NC01MDA0LTRiZTAtOGI5Ny1lNDIyOGM5MTBhMTAiLCJyaCI6IjAuQVRjQWpuSUFLdER3dEVDazZNNURQei04cHdNQUFBQUFBQUFBd0FBQUFBQUFBQUQxQUFBLiIsInN1YiI6IjA5MjBiYzk0LTUwMDQtNGJlMC04Yjk3LWU0MjI4YzkxMGExMCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJOQSIsInRpZCI6IjJhMDA3MjhlLWYwZDAtNDBiNC1hNGU4LWNlNDMzZjNmYmNhNyIsInV0aSI6IlBjSlRld2NJdmtpZURYLXJQZjFlQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjA5OTdhMWQwLTBkMWQtNGFjYi1iNDA4LWQ1Y2E3MzEyMWU5MCJdLCJ4bXNfdGNkdCI6MTM0NDI2NDg0OH0.fH925oN_KGWpmcoYh9TpHwmrznZcW1XoL_Vac_LvDUp4CEzDtlOXj-SOSBYL8YOZsVpL1MfTXf9k3XCsy811kLIXzy7FATco94_5Ongnchm6XC6-SfEdMOsHQsO0EC01-hFdLv0MS518Cmevs-RCskBMVXzZXfZMTTpx46_OcGJFmBIg26wA0W4Eo6KLvmAduSI33NEcsFz1qh58B9G7z54-FY2VfL32Aye668HSE1RTZqKKa7c2Ctgwg0rzIx5qh8dZ4vjrFREwJFE7guQO-ztDIXLWHWVc9jW6Cxb9HF6GfmHLGB-l3NpWDakQkCxMd_t9wrAu-JJPff4uYG_UtQ'

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
    email_messages = response.json()['value']
    
    # Process each email message
    for message in email_messages:
        print('Sender:', message['from']['emailAddress']['address'])
        print('Subject:', message['subject'])
        print('Body:', message['body']['content'])
        print('---')
else:
    print('Error:', response.text)
