import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateRandomString } from '@/utils/generateRandomString';

const client_id = process.env.SPOTIFY_CLIENT_ID as string;
const redirect_uri = `${process.env.NEXTAUTH_URL}/api/auth/callback`;



export async function GET(req: NextRequest) {
  const scope = "streaming user-read-email user-read-private";
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize/?${auth_query_parameters.toString()}`);
}
