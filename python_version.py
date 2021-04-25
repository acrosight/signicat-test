import config
import requests
import json


def get_token():
    # Token url
    token_endpoint = "https://api.signicat.io/oauth/connect/token"
    # Setting the grant type to client_credentials
    data = {'grant_type':'client_credentials', 'scope':'identify'}
    # Posting to token url with HTTP basic authentication
    token = requests.post(token_endpoint, data=data,allow_redirects=True, auth=(config.CLIENT_ID, config.CLIENT_SECRET))
    # Converting json string to json
    token_json = json.loads(token.text)
    
    access_token = token_json['access_token']
    print(access_token)
    return access_token

def get_id(token):
    # Endpoint url
    endpoint = "https://api.idfy.io/identification/v2/sessions"
    # Setting headers with the authorization bearer
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    data = {
        "languages": "en",
        "flow": "redirect",
        "allowedProviders": [
            "no_bankid_netcentric",
            "no_bankid_mobile"
        ],
        "include": [
            "name",
            "date_of_birth",
            "nin"
        ],
        "redirectSettings": {
            "successUrl": "https://example.com/success",
            "abortUrl": "https://example.com/abort",
            "errorUrl": "https://example.com/error"
        }
    }
    # Converting the data into a json
    response = requests.post(endpoint, data=json.dumps(data), headers=headers).json()
    print(response['id'], response['url'])
    
    return response['id']

def get_session():
    token  = get_token()
    _id = get_id(token)
    headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    endpoint = f"https://api.signicat.io/identification/v2/sessions/{_id}" 
    response = requests.get(endpoint, headers=headers).json()
    print(response)
    

get_session()