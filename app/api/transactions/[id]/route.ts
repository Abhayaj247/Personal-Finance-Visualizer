import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const transaction = await Transaction.findById(context.params.id).populate('category');
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const transaction = await Transaction.findByIdAndUpdate(
      context.params.id,
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

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const transaction = await Transaction.findByIdAndDelete(context.params.id);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
