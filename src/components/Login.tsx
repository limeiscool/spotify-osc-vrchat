"use client";
import Link from 'next/link'
import React from 'react';

function LoginComponent() {

    return (
        <div className="App">
          <Link href="/api/auth/login">
              Login with Spotify
          </Link>
          
        </div>
    );
}

export default LoginComponent;
