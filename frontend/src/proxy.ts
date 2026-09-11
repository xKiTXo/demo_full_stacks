import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ACCESS_TOKEN } from './config/constants'

export default function proxy(request: NextRequest) {

  const token = request.cookies.get(ACCESS_TOKEN)?.value

  if (!token && (request.nextUrl.pathname.startsWith('/dashboard'))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    const response = NextResponse.redirect(loginUrl)
    return response;

  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
