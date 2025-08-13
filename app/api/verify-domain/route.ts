import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.domains.verify('1d1154c7-cc52-41ef-b34f-712bf8d5db87');
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}