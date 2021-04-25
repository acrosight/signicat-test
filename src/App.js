import './App.css';
import React, {useState} from 'react'

function App(){
  const [id, setID] = useState('')

  async function getId() {
    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBDNDM2MjY4OEVENzBFNkQ1OTIyNzZGRDE1OUFDRDBBMDI0QjUwOTIiLCJ0eXAiOiJKV1QifQ.eyJuYmYiOjE2MTkzNDYyODksImV4cCI6MTYxOTM0OTg4OSwiaXNzIjoiaHR0cHM6Ly9sb2dpbi10ZXN0LmlkZnkubm8iLCJhdWQiOlsiaWRlbnRpZmljYXRpb24iLCJodHRwczovL2xvZ2luLXRlc3QuaWRmeS5uby9yZXNvdXJjZXMiXSwiY2xpZW50X2lkIjoidDg3NTBmZTg0YTFlODQzYjJiOTdiZTlmZjg4ODMwZDA5IiwiY2xpZW50X3NhdCI6IkFjY291bnQiLCJjbGllbnRfc2FpIjoiNjBjY2VhZjgtM2E0ZS00Njc5LTkxZDgtYWQxMzAwYTE3MmE5IiwiY2xpZW50X293bmVydHlwZSI6IkFjY291bnQiLCJjbGllbnRfb3duZXJpZCI6IjYwY2NlYWY4LTNhNGUtNDY3OS05MWQ4LWFkMTMwMGExNzJhOSIsImNsaWVudF9lbnYiOiJUZXN0IiwianRpIjoiNjUwMDY0RkREMTg3QTUzRUZCQ0MwMTZDQjEzRkI1NDkiLCJpYXQiOjE2MTkzNDYyODksInNjb3BlIjpbImlkZW50aWZ5Il0sInRlbmFudCI6eyJwIjoiaWRlbnRpZnkiLCJ0IjoiQWNjb3VudCIsImkiOiI2MGNjZWFmOC0zYTRlLTQ2NzktOTFkOC1hZDEzMDBhMTcyYTkiLCJhIjoiVXNlciJ9fQ.pEirLiCuhZtBLbsdCVxUx2doag7HVapWCTaEzHPAMCUkeuBIBAq4RKf5pkTwfsfLkHiBcUWmqtv0sKJEbydkxdttQZ4S4YYyXCIgzzxGOziVr_fGuunw4ENxXfWt8bKVdYzmH8ciJrwfA2m7krxXPlItOcqXvo3IJgSutt1M7WYphDeXnZCAnMlbuqDO_H--ul0TuVepChQCNpfcrIldEHAy3vWdsXL-9Zt0WaDJWcqQ_ioxTkpO_N1tEPtd5tCQtSRglg6aJpzAWlHo0RnABSWgpVBlLy4rrSwNVWrvylXRDhqqPbeZndBGd_dAcYKnv2Sdeh0czXlTxUMQBywTkg"
    //const token = getToken();
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
      }
    );
    console.log(res.status);
    const data = await res.json();
    console.log(data);
    const url = data.url;
    setID(data.id)
    window.open(url);
  }

  async function getToken() {
    const client_id = "t8750fe84a1e843b2b97be9ff88830d09"
    const client_secret = "1gq3CibSqZPpj2jKUjfcMPcA9Eoryj8bcMkgcrsgPrxHiNs5N94VplJpLGAWcODo"

    // Turning into HTML Basic Authentication with base-64 formatting
    const authorizationBasic = `Basic ` + btoa(`${client_id}:${client_secret}`);

    let header = {
      'Authorization': authorizationBasic,
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    const payload = { "grant_type": "client_credentials", "scope": "identify" }
    const data = new URLSearchParams()
    data.append('grant_type', 'client_credentials')
    data.append('scope', 'identify')

    console.log(authorizationBasic)

    console.log(header)
    const res = await fetch("https://api.signicat.io/oauth/connect/token", {
        method: "POST",
        mode: 'no-cors',
        headers: header,
        body: data,
    })
    console.log(res.status)
    //const data = await res.json();
    //console.log(data.access_token);
  }

  async function buttonPress() {
    const res = await fetch (`https://api.signicat.io/identification/v2/sessions/${id}`)
    const data = res.json();
  }

    return (
      <div className="App">
        <header className="header">This is a Signicat Developer Test</header>
        <input className="btn" type="button" value="Fetch" onClick={getToken}/>
      </div>
    );
  }

export default App;
