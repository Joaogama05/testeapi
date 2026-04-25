import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Edge Proxy: Missing or invalid Authorization header');
    return NextResponse.json(
      { error: 'Unauthorized: Missing or malformed token' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

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
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/children/:id*/review'],
};
