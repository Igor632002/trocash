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
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/assets/')) {
    return NextResponse.next()
  }
  const hasLocalePrefix = ['/pt', '/en', '/uk'].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
  // Routes like /exchange/pt, /safety/pt, /how/en already carry the locale as a segment
  const hasSegmentLocale = /^\/[^/]+\/(pt|en|uk)(\/|$)/.test(pathname)

  // Routes that exist without a locale prefix and must not be rewritten
  const noRewrite = ['/auth', '/api', '/exchange', '/offers', '/profile', '/chat', '/chat-test']
  if (noRewrite.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next()
  }

  if (localePath && !hasLocalePrefix && !hasSegmentLocale) {
    const url = req.nextUrl.clone()
    url.pathname = localePath + pathname
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  // match all requests except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
