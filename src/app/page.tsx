"use client";

import { useEffect, useState } from 'react';
import WebPlayback from "../components/WebPlayback";





export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch('/api/token');
        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
        } else {
          console.error('Failed to retrieve token');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    fetchToken();
  }, []);

 
  return (
    <>
      {token && <WebPlayback token={token} />}
    </>
  );
}
