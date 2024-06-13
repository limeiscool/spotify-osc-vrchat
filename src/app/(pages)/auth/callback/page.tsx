"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';


export default function Callback() {

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (code) {
      fetch('/api/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      }).then((response) => {
        if (response.ok) {
          router.push('/');
        } else {
          console.log('Failed to get access token');
          router.push('/login');
        }
      }).catch((error) => {
        console.error('Error getting access token:', error);
        router.push('/login');
      });

    } else {
      console.log('No code provided');
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div>
      Please wait...
    </div>
  )
}