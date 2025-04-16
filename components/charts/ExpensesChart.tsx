import { useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
}

interface ExpensesChartProps {
  transactions: Transaction[];
}

interface ChartData {
  name: string;
  total: number;
}

export default function ExpensesChart({ transactions }: ExpensesChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const processChartData = () => {
      const endDate = new Date();
      const startDate = subMonths(endDate, 5);

      // Create array of the last 6 months
      const months = eachMonthOfInterval({
        start: startDate,
        end: endDate,
      });

      const monthlyData = months.map(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);

        const monthlyTotal = transactions
          .filter(t => {
            const txDate = new Date(t.date);
            return txDate >= monthStart && txDate <= monthEnd;
          })
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          name: format(month, 'MMM'),
          total: parseFloat(monthlyTotal.toFixed(2)),
        };
      });

      setChartData(monthlyData);
    };

    processChartData();
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Not enough data to show chart</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                formatter={(value) => [`₹${value}`, 'Total']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}