import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublic = path === '/login'

  const token = request.cookies.get('spotify-token')?.value || ''

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

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