import base64
import hashlib
import os
import requests
from flask import Flask, redirect, request, session, jsonify, url_for

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Generate a random secret key

# Azure AD app (client) ID
client_id = '5d62298a-1bfd-4c7b-9d54-ae36db61db15'  # Replace with your client ID

# Azure AD authority URL
authority = 'https://login.microsoftonline.com/common'

# Microsoft Graph API base URL
graph_api_base_url = 'https://graph.microsoft.com/v1.0'

@app.route('/login')
def login():
    # Generate a random string as the code verifier
    code_verifier = os.urandom(64).hex()

    # Generate the code challenge from the code verifier
    code_challenge = hashlib.sha256(code_verifier.encode()).digest()
    code_challenge = base64.urlsafe_b64encode(code_challenge).rstrip(b'=').decode()

    # Store the code verifier in the session
    session['code_verifier'] = code_verifier

    # Build the authorization URL with PKCE parameters
    authorization_url = f'{authority}/oauth2/v2.0/authorize?client_id={client_id}&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A5000%2Fcallback&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fuser.read%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&code_challenge={code_challenge}&code_challenge_method=S256'

    return redirect(authorization_url)

@app.route('/callback')
def callback():
    # Ensure the state parameter matches the stored state
    if request.args.get('state') != session.get('state'):
        return 'Invalid state parameter', 400

    # Ensure the code parameter is present
    if 'code' not in request.args:
        return 'Code parameter missing', 400

    # Exchange the authorization code for an access token
    token_data = {
        'client_id': client_id,
        'grant_type': 'authorization_code',
        'code': request.args.get('code'),
        'redirect_uri': 'http://localhost:5000/callback',
        'code_verifier': session['code_verifier']
    }

    token_response = requests.post(f'{authority}/oauth2/v2.0/token', data=token_data)
    token_response.raise_for_status()
    token_info = token_response.json()

    # Store the access token in the session
    session['access_token'] = token_info['access_token']

    return redirect(url_for('inbox'))

@app.route('/inbox')
def inbox():
    # Ensure the access token is present in the session
    if 'access_token' not in session:
        return 'Access token missing', 400

    # Get the access token from the session
    access_token = session['access_token']

    # Construct the request headers with the access token
    headers = {'Authorization': f'Bearer {access_token}'}

    # Call the Microsoft Graph API to get the user's inbox messages
    response = requests.get(f'{graph_api_base_url}/me/mailfolders/inbox/messages', headers=headers)
    response.raise_for_status()
    inbox_messages = response.json()

    return jsonify(inbox_messages)

if __name__ == '__main__':
    app.run(debug=True, ssl_context='adhoc')  # Run the app in debug mode with ad-hoc SSL context
