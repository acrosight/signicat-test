import './App.css';
import React, {useState} from 'react'

function App(){
  // Variables to store important information
  const [id, setId] = useState('')
  const [identity, setIdentity] = useState(null)


  async function getToken() {
    // The client_id and client_secret
    const client_id = "t8750fe84a1e843b2b97be9ff88830d09"
    const client_secret = "1gq3CibSqZPpj2jKUjfcMPcA9Eoryj8bcMkgcrsgPrxHiNs5N94VplJpLGAWcODo"

    // Turning into HTML Basic Authentication with base-64 formatting
    const authorizationBasic = `Basic ` + btoa(`${client_id}:${client_secret}`);

    let header = {
      'Authorization': authorizationBasic,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': 'http://localhost:3000/'
    }

    const payload = { "grant_type": "client_credentials", "scope": "identify" }

    const res = await fetch("https://api.signicat.io/oauth/connect/token", {
        method: "POST",
        mode: 'no-cors',
        credentials: 'include',
        headers: header,
        body: JSON.stringify(payload),
    })

    console.log(res)
    // const data = await res.json();
    // console.log(data.access_token);
    // return data.access_token
  }

  async function getId() {
    // Retrieving a token
    const token = getToken();
    // Standard request 
    const payload = {
      "flow": "redirect",
      "allowedProviders": ["no_bankid_netcentric", "no_bankid_mobile"],
      "include": ["name", "date_of_birth"],
      "redirectSettings": {
        "successUrl": "https://developer.signicat.io/landing-pages/identification-success.html",
        "abortUrl": "https://developer.signicat.io/landing-pages/something-wrong.html",
        "errorUrl": "https://developer.signicat.io/landing-pages/something-wrong.html",
      },
    };
    
    const res = await fetch(
      "https://api.idfy.io/identification/v2/sessions",
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

    console.log(res.status);
    const data = await res.json();
    console.log(data);

    // Opening the url in a popup window
    window.open(data.url);

    setId(data.id)
    return data.id
  }

  // Saving the identification session
  async function getIdentity() {
    // Retrieving the token
    const token = await getToken();
    const res = await fetch (`https://api.signicat.io/identification/v2/sessions/${id}`, 
    {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    console.log(res.status)
    const data = await res.json();
    // Storing the identity of the user
    setIdentity(data.identity)
  }

  // If the user has not logged in
  if(identity===null){
    return (
      <div style={container}>
        <header className="header">Press the authenticate button create a Identification session</header>
        {/* Used to test the getToken method, but will be replaced with getId */}
        <div style={wrapper}>
          <input style={button} type="button" value="Authenticate" onClick={getToken}/>
          <input style={button} type="button" value="Get user info" onClick={getIdentity}/>
        </div>
      </div>
    );
  } else {
    return(
      <div style={container}>
        <div style={wrapper}>
          <text>Name: {identity.fullName}</text>
          <text>Date of Birth: {identity.dateOfBirth}</text>
        </div>
      </div>
    )
  }
  
}

export default App;

const container = {
  padding: 20,
  textAlign: 'center',
}

const wrapper =  {
  display: 'flex',
  flexDirection: 'column',

  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 10,
  padding: 10,
  width: '40%',
}

const button = {
  marginBottom: 10
}