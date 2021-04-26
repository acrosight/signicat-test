import config
import webbrowser
import requests
import time
import json

class signicat_test:
    def __init__(self):
        self._id = ""
        self.identification = {} 
        self.token = self.get_token()

    def get_token(self):
        """ This function will send a request with HTTP Basic authentication to receive a token
            
            Returns: 
            String -- Token
        """ 
        
        # Token url
        token_endpoint = "https://api.signicat.io/oauth/connect/token"
        # Setting the grant type to client_credentials
        data = {'grant_type':'client_credentials', 'scope':'identify'}
        # Posting to token url with HTTP basic authentication
        token = requests.post(token_endpoint, data=data,allow_redirects=True, auth=(config.CLIENT_ID, config.CLIENT_SECRET))
        # Converting json string to json
        token_json = json.loads(token.text)
        
        # Returning the access_token
        return token_json['access_token']

    def get_id(self):
        """ This function fetches the id of a session and directs the user to BankID authentication

        Returns:
            [String]: Session ID
        """
        # Endpoint url
        endpoint = "https://api.idfy.io/identification/v2/sessions"
        # Setting headers with the authorization bearer
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {self.token}'}
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
                "phone_number",
                "nin"
            ],
            "redirectSettings": {
                "successUrl": "https://example.com/success",
                "abortUrl": "https://example.com/abort",
                "errorUrl": "https://example.com/error"
            }
        }
        # Converting the data into a json string and sending a post request 
        response = requests.post(endpoint, data=json.dumps(data), headers=headers).json()
        # Opening the browser and to authenticate the user
        webbrowser.open(response['url'])
        # Giving the user time to authenticate through BankID, before we return the id
        self._id = response['id']
        print(self._id)
        time.sleep(20)
        return response['id']

    def get_session(self):
        """ This function retrieves the identification session by using the id we found by logging in with BankID 
        """
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {self.token}'}
        endpoint = f"https://api.signicat.io/identification/v2/sessions/{self._id}" 
        
        response = requests.get(endpoint, headers=headers).json()
        print(self._id)
        print(response['data'][0])
        
        self.identification = response['identity']
        return response['identity']