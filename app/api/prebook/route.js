// app/api/prebook/route.js
import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Prebook from '@/models/Prebook';

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();
    const newPrebook = await Prebook.create(body);
    return NextResponse.json({ success: true, data: newPrebook });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to save prebook data' }, { status: 500 });
  }
}
