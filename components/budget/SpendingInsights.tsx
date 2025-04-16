interface BudgetActual {
  category: string;
  amount: number;
}

interface SpendingInsightsProps {
  budgets: BudgetActual[];
  actuals: BudgetActual[];
}

export default function SpendingInsights({ budgets, actuals }: SpendingInsightsProps) {
  const insights = budgets.map((b) => {
    const actual = actuals.find((a) => a.category === b.category);
    const spent = actual ? actual.amount : 0;
    const percentUsed = (spent / b.amount) * 100;

    if (percentUsed > 100) {
      return `You have exceeded your budget for ${b.category} by ${(
        percentUsed - 100
      ).toFixed(1)}%.`;
    } else if (percentUsed > 80) {
      return `You have used ${percentUsed.toFixed(1)}% of your budget for ${b.category}.`;
    } else if (percentUsed > 50) {
      return `You have used ${percentUsed.toFixed(1)}% of your budget for ${b.category}. Keep an eye on it.`;
    } else {
      return `You have used ${percentUsed.toFixed(1)}% of your budget for ${b.category}. Good job!`;
    }
  });

  return (
    <div className="p-4 border rounded-md shadow-sm max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-2">Spending Insights</h3>
      <ul className="list-disc list-inside text-gray-700">
        {insights.map((insight, i) => (
          <li key={i}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}