import { format } from "date-fns";

interface CategorySummary {
  _id: string;
  name: string;
  color: string;
  totalAmount: number;
  percentage: number;
}

interface Category {
  _id: string;
  name: string;
  color: string;
  icon?: string;
}

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: Category | null;
}

interface SummaryCardsProps {
  totalExpenses: number;
  categoryTotals: CategorySummary[];
  latestTransaction: Transaction | null;
}

export default function SummaryCards({
  totalExpenses,
  categoryTotals,
  latestTransaction,
}: SummaryCardsProps) {
  const topCategory =
    categoryTotals.length > 0 && totalExpenses > 0 ? categoryTotals[0] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-md border p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
        <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
      </div>

      <div className="rounded-md border p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Top Category</h3>
        {topCategory ? (
          <>
            <div className="flex items-center mb-1">
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: topCategory.color }}
              ></span>
              <span>{topCategory.name}</span>
            </div>
            <p>
              ₹{topCategory.totalAmount.toFixed(2)} ({topCategory.percentage.toFixed(0)}%)
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No category data</p>
        )}
      </div>

      <div className="rounded-md border p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Latest Transaction</h3>
        {latestTransaction ? (
          <>
            <p className="text-2xl font-bold">₹{latestTransaction.amount.toFixed(2)}</p>
            <p className="text-muted-foreground">
              {latestTransaction.description || "No description"} -{" "}
              {format(new Date(latestTransaction.date), "MM/dd/yyyy")}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No transactions</p>
        )}
      </div>
    </div>
  );
}
