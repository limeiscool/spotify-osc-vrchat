import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { setCookie } from 'cookies-next';

const client_id = process.env.SPOTIFY_CLIENT_ID as string;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }).toString()
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  return response.json();
}

export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get('spotify-refresh-token')?.value;

  if (!refreshToken) {
    return NextResponse.redirect('/login');
  }

  try {
    const newTokens = await refreshAccessToken(refreshToken);
    const { access_token, expires_in, refresh_token: newRefreshToken } = newTokens;

    const currentTime = Math.floor(Date.now() / 1000);

    // Update cookies
    setCookie('spotify-token', access_token, { maxAge: expires_in });
    setCookie('spotify-token-expiry', currentTime + expires_in);

    if (newRefreshToken) {
      setCookie('spotify-refresh-token', newRefreshToken);
    }

    return NextResponse.redirect('/');
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.redirect('/login');
  }
}
