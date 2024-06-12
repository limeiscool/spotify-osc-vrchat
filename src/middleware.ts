import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'




export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublic = path === '/login'

  const token = request.cookies.get('spotify-token')?.value || ''

  // Check if token is expired or close to expiring
  const expiryTime = parseInt(request.cookies.get('spotify-token-expiry')?.value || '0', 10);
  const currentTime = Math.floor(Date.now() / 1000);

  if (expiryTime && currentTime >= expiryTime - 300) {
    // Redirect to refresh token endpoint
    return NextResponse.redirect(new URL('/api/refresh_token', request.url));
  }

  // if on public route with valid access token, redirect to home
  if (isPublic && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // if on private route without access token, redirect to login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}


export const config = {
  matcher: [
   '/',
   '/login',
  ]
}