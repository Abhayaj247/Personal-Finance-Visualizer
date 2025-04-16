"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataItem {
  category: string;
  budget: number;
  actual: number;
}

interface BudgetVsActualChartProps {
  budgets: { category: string; amount: number }[];
  actuals: { category: string; amount: number }[];
}

export default function BudgetVsActualChart({
  budgets,
  actuals,
}: BudgetVsActualChartProps) {
  const data: DataItem[] = budgets.map((b) => {
    const actual = actuals.find((a) => a.category === b.category);
    return {
      category: b.category,
      budget: b.amount,
      actual: actual ? actual.amount : 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="budget" fill="#8884d8" />
        <Bar dataKey="actual" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
