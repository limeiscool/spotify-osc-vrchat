import { NextResponse } from "next/server";

const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
const spotify_client_id = process.env.SPOTIFY_CLIENT_ID!;

export async function GET() {

  const scope = "streaming \
               user-read-email \
               user-read-private"

  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: "http://localhost:3000/auth/callback",
    state: state
  })

  NextResponse.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
  
}