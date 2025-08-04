import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('sessionToken', { path: '/' });  // delete cookie
  return NextResponse.json({ success: true, message: 'Logged out' });
}
