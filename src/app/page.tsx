"use client";

import React, { useState, useEffect } from 'react';

import Login from "./components/Login";
import WebPlayback from "./components/WebPlayback";
export default function Home() {
  const [token, setToken] = useState<string>('');

  useEffect(() => {

    async function getToken() {
      const response = await fetch('api/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);


  return (
    <>
    {(token === '') ? <Login/> : <WebPlayback token={token} />}
    </>
  );
}
