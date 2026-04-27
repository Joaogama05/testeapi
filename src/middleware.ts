import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get('token')?.value;
  const authHeader = request.headers.get('authorization');
  const token = cookieToken || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'chave-secreta-padrao-para-mvp-apenas'
    );
    
    const { payload } = await jwtVerify(token, secret);
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-username', payload.preferred_username as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Edge Proxy: Token validation failed', error);
    
    const response = pathname.startsWith('/api') 
      ? NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));
      
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
