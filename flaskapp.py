from flask import Flask, request, redirect, session, url_for
import requests
import pprint

app = Flask(__name__)
app.secret_key = 'sked-2-20-cs'
scopes = ['openid', 'profile', 'offline_access', 'Mail.Read']  # Add additional scopes as needed


@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    redirect_uri = 'http://localhost:5000/callback'  # Update with your redirect URI

    authorization_url = (
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
        '?client_id=5d62298a-1bfd-4c7b-9d54-ae36db61db15'  # Replace with your client ID
        '&response_type=code'
        '&redirect_uri=' + redirect_uri +
        '&scope=' + ' '.join(scopes)
    )

    return redirect(authorization_url)

@app.route('/callback')
def callback():
    if 'code' in request.args:
        code = request.args.get('code')

        token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
        redirect_uri = 'http://localhost:5000/callback'  # Update with your redirect URI
        client_id = '5d62298a-1bfd-4c7b-9d54-ae36db61db15'  # Replace with your client ID
        client_secret = 'dPO8Q~R.eM0pWIlGqHQhqIP2ACjMukfSMvDKvaiB'  # Replace with your client secret

        token_payload = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            'redirect_uri': redirect_uri,
            'scope': ' '.join(scopes)
        }

        token_response = requests.post(token_url, data=token_payload).json()
        access_token = token_response.get('access_token')

        # Store access token in session (in production, consider more secure storage options)
        session['access_token'] = access_token

        return redirect(url_for('inbox'))
    else:
        return 'Error: Authorization code not received'

@app.route('/inbox')
def inbox():
    if 'access_token' in session:
        access_token = session['access_token']

        headers = {
            'Authorization': 'Bearer ' + access_token
        }

        inbox_url = 'https://graph.microsoft.com/v1.0/me/mailfolders/inbox/messages'
        
        inbox_response = requests.get(inbox_url + '?$top=1', headers=headers)
        

        if inbox_response.status_code == 200:
            inbox_messages = inbox_response.json()
            pprint.pprint(inbox_messages) 
            return 'Latest message printed to terminal'
        else:
            return 'Error retrieving inbox messages: ' + str(inbox_response.status_code)
    else:
        return 'Error: Access token not found in session'

if __name__ == '__main__':
    app.run(debug=True)
