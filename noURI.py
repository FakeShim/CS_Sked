import requests
import json
import os

# Microsoft Graph API endpoint for accessing emails
graph_endpoint = 'https://graph.microsoft.com/v1.0/users/37bee037-09ad-4537-b26f-ee93bf091390/mailfolders/inbox/messages'

# Function to retrieve access token using MSAL
def get_access_token():
    # Your Azure AD tenant ID
    tenant_id = '2a00728e-f0d0-40b4-a4e8-ce433f3fbca7'
    # Azure AD app (client) ID and client secret
    client_id = '5d62298a-1bfd-4c7b-9d54-ae36db61db15'
    client_secret = 'dPO8Q~R.eM0pWIlGqHQhqIP2ACjMukfSMvDKvaiB'
    
    # MSAL endpoint and necessary parameters
    token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "client_id": client_id,
        "scope": "https://graph.microsoft.com/.default",
        "client_secret": client_secret,
        "grant_type": "client_credentials"
    }
    
    # Send POST request to get access token
    response = requests.post(token_url, headers=headers, data=data)
    access_token = response.json().get("access_token")
    return access_token

# Function to get the most recent email's body from Outlook
def get_recent_email_body():
    access_token = get_access_token()
    if access_token:
        print("Successfully retrieved access token.")
        headers = {
            "Authorization": "Bearer " + access_token,
            "Accept": "application/json"
        }
        params = {
            "$orderby": "receivedDateTime desc",
            "$top": "1",
            "$select": "body"
        }
        response = requests.get(graph_endpoint, headers=headers, params=params)
        if response.status_code == 200:
            email_data = response.json()
            if email_data.get("value"):
                email_body = email_data["value"][0]["body"]["content"]
                return email_body
        else:
            print("Failed to retrieve email:", response.status_code)
    else:
        print("Failed to retrieve access token.")

# Function to save email body to a text file
def save_to_text_file(body):
    with open("recent_email.txt", "w") as file:
        file.write(body)

# Main function
def main():
    email_body = get_recent_email_body()
    if email_body:
        save_to_text_file(email_body)
        print("Email body saved to recent_email.txt.")
    else:
        print("No email body found.")

if __name__ == "__main__":
    main()
