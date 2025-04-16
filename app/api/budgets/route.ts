import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Budget from "@/models/Budget";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const url = new URL(request.url);
    const month = url.searchParams.get("month");
    const budgets = await Budget.find(month ? { month } : {}).populate("category");
    return NextResponse.json(budgets);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const budget = await Budget.findOneAndUpdate(
      { category: body.category, month: body.month},
      { amount: body.amount },
      { upsert: true, new: true }
    );

    return NextResponse.json(budget);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to save budget" }, { status: 500 });
  }
}
