import requests

# Define Microsoft Graph API endpoint for retrieving email messages
graph_api_endpoint = 'https://graph.microsoft.com/v1.0/users/37bee037-09ad-4537-b26f-ee93bf091390/mailfolders/inbox/messages'

# Define user credentials
username = 'peshim@crimson.ua.edu'  # Replace with your username (user principal name)
password = 'Retep-mihs0727'  # Replace with your password

client_id = '5d62298a-1bfd-4c7b-9d54-ae36db61db15'
client_secret = 'dPO8Q~R.eM0pWIlGqHQhqIP2ACjMukfSMvDKvaiB'


# Make a request to obtain an access token using the provided credentials
token_url = 'https://login.microsoftonline.com/2a00728e-f0d0-40b4-a4e8-ce433f3fbca7/oauth2/v2.0/token'
tenant_id = '2a00728e-f0d0-40b4-a4e8-ce433f3fbca7'  # Replace with your Azure AD tenant ID

token_payload = {
    'grant_type': 'password',
    'client_id' : client_id,
    'client_secret' : client_secret,
    'scope': 'https://graph.microsoft.com/.default',
    'username': username,
    'password': password
}

token_response = requests.post(token_url, data=token_payload)

# Check if access token was obtained successfully
if token_response.status_code == 200:
    access_token = token_response.json().get('access_token')

    # Request headers with access token
    headers = {
        'Authorization': 'Bearer {}'.format(access_token),
        'Content-Type': 'application/json'
    }

    # Make GET request to retrieve email messages
    response = requests.get(graph_api_endpoint.format(user_id=username), headers=headers)

    # Check if request was successful
    if response.status_code == 200:
        # Parse response JSON to extract email message data
        email_messages = response.json()

        # Print email messages
        print(email_messages)
    else:
        print('Error:', response.text)
else:
    print('Failed to obtain access token:', token_response.text)
