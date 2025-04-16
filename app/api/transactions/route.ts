import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await Transaction.find({}).populate('category').sort({ date: -1 });
    return NextResponse.json(transactions);
  } catch{
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const transaction = new Transaction({
      amount: body.amount,
      date: new Date(body.date),
      description: body.description,
      category: body.category || null,
    });

    await transaction.save();
    await transaction.populate('category');
    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
