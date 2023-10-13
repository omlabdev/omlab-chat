import { withAuth } from 'next-auth/middleware'

import { isAdmin } from './helpers'

export default withAuth(
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        const { pathname } = req.nextUrl
        const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/uploadthing')
        const isDemoRoute = pathname.startsWith('/demo')

        // If there's no token but the user is not accessing admin or demo let them through
        if (!token) return ((!isAdminRoute) && (!isDemoRoute))
        if (!token.email) return false

        // If the user is an admin let them through
        if (isAdmin(token.email)) return true

        // If the user is trying to access a demo route let them through
        // Since we can't check the DB here the demo page will then check if the user is allowed into that specifc demo
        if (isDemoRoute) return true

        return true
      },
    },
  }
)
