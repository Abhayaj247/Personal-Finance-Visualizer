import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const category = await Category.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
