import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST() {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'chave-secreta-padrao-para-mvp-apenas'
  );

  const token = await new SignJWT({ preferred_username: 'tecnico_admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);

  return NextResponse.json({ token });
}
