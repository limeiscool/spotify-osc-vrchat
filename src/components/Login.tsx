import Link from 'next/link'
import React, { PropsWithChildren } from 'react';

function LoginComponent() {

  async function handleGetAccessToken() {

    try {
      const response = await fetch('api/auth/login', {
        method: 'GET',
        
      })
    } catch (error: any) {
      console.log(error.reqsponse.data.error)
    }
  }

    return (
        <div className="App">
          <button onClick={handleGetAccessToken}>
            Login with Spotify
          </button>
        </div>
    );
}

export default LoginComponent;
