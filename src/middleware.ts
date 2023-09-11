import { NextRequest, NextResponse } from 'next/server'

import { withAuth } from 'next-auth/middleware'

import { setSessionIdCookie } from './helpers'

export default withAuth(function middleware(request: NextRequest) {
    if (!request.cookies.has('sessionId')) {
      const response = NextResponse.next()
      setSessionIdCookie(response)
      return response
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => (
        true ||
        (token !== null) || (!req.nextUrl.pathname.startsWith('/admin'))
      ),
    },
  }
)
