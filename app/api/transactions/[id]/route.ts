import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/Transaction';

function extractIdFromRequest(req: NextRequest): string | null {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  return segments[segments.length - 1] || null;
}

export async function GET(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });

  try {
    await connectToDatabase();
    const transaction = await Transaction.findById(id).populate('category');
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });

  try {
    const body = await req.json();
    await connectToDatabase();

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        amount: body.amount,
        date: new Date(body.date),
        description: body.description,
        category: body.category || null,
      },
      { new: true, runValidators: true }
    ).populate('category');

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = extractIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });

  try {
    await connectToDatabase();
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
