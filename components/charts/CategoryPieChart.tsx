import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Category {
  _id: string;
  name: string;
  color: string;
}

interface Transaction {
  _id: string;
  amount: number;
  category: Category | null;
}

interface CategoryPieChartProps {
  transactions: Transaction[];
}

interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}

export default function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const [categoryData, setCategoryData] = useState<CategoryTotal[]>([]);
  const [categories, setCategories] = useState<{[key: string]: Category}>({});

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data: Category[] = await response.json();
          const categoryMap = data.reduce((acc, cat) => {
            acc[cat._id] = cat;
            return acc;
          }, {} as {[key: string]: Category});
          setCategories(categoryMap);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (Object.keys(categories).length === 0 || transactions.length === 0) return;

    const categoryTotals: {[key: string]: number} = {};

    transactions.forEach(transaction => {
      let categoryId: string;
      if (!transaction.category) {
        categoryId = 'uncategorized';
      } else {
        categoryId = transaction.category._id;
      }
      if (!categoryTotals[categoryId]) categoryTotals[categoryId] = 0;
      categoryTotals[categoryId] += transaction.amount;
    });

    const data = Object.entries(categoryTotals).map(([catId, total]) => {
      const cat = categories[catId];
      return {
        name: cat ? cat.name : "Uncategorized",
        value: total,
        color: cat ? cat.color : "#CCCCCC",
      };
    });
    setCategoryData(data);
  }, [transactions, categories]);

  if (categoryData.length === 0) {
    return <div className="text-muted-foreground text-center">No data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
