import { NextResponse } from 'next/server'

// Map hostnames to a path prefix. Replace the example hostnames below with your real domains.
// For example:
//  'trocash.pt' -> serves content from '/pt' while URL stays as https://trocash.pt/
//  'trocash.com' -> serves content from '/en' while URL stays as https://trocash.com/
//  'trocash.ua' -> serves content from '/uk' while URL stays as https://trocash.ua/
const domainMap = {
  'trocash.pt': '/pt',
  'www.trocash.pt': '/pt',
  'trocash.com': '/en',
  'www.trocash.com': '/en',
  'trocash.ua': '/uk',
  // add or edit mappings for your real hostnames
}

export function middleware(req) {
  const host = req.headers.get('host') || ''
  const hostname = host.split(':')[0]
  const localePath = domainMap[hostname]

  if (localePath) {
    const url = req.nextUrl.clone()
    if (!url.pathname.startsWith(localePath)) {
      url.pathname = localePath + url.pathname
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  // match all requests except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
