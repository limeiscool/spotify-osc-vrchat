import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { setCookie } from 'cookies-next';

const client_id = process.env.SPOTIFY_CLIENT_ID as string;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;
const redirect_uri = `${process.env.NEXTAUTH_URL}/auth/callback` as string;

interface SpotifyTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

async function getAccessToken(code: string): Promise<SpotifyTokenResponse> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirect_uri,
      client_id: client_id,
      client_secret: client_secret
    }).toString()
  }).catch((error) => {
    throw new Error('Failed to get access token', error);
  });

  console.log("response", response)

  return response.json();
}

export async function POST(req: NextRequest) {
  // get code from the request body
  try {
    const { code, state } = await req.json();

    if (!state) {
      return NextResponse.json({ error: 'state_mismatch' }, { status: 400 });
    }

    const { access_token, refresh_token, expires_in } = await getAccessToken(code);
    if (!access_token || !refresh_token || !expires_in) {
      return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
    }
    const currentTime = Math.floor(Date.now() / 1000);

    const response = NextResponse.json({ success: true }, { status: 200 });

    // Set tokens in cookies
    response.cookies.set('spotify-token', access_token);
    response.cookies.set('spotify-refresh-token', refresh_token);
    response.cookies.set('spotify-token-expiry', String(currentTime + expires_in));

    return response;
  } catch (error) {
    console.log('Error getting access token:', error);
    return NextResponse.json({ error: 'Failed to get access token'}, { status: 500 });
  }
}
