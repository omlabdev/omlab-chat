import { withAuth } from 'next-auth/middleware'

export default withAuth(
  {
    callbacks: {
      authorized: ({ req, token }) => (
        (token !== null) ||
        (
          (!req.nextUrl.pathname.startsWith('/admin')) &&
          (!req.nextUrl.pathname.startsWith('/api/uploadthing'))
        )
      ),
    },
  }
)
