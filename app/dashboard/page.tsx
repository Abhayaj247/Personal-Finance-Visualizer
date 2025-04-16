"use client";

import { useState, useEffect, useCallback } from "react";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import TransactionList from "@/components/transactions/TransactionList";
import ExpensesChart from "@/components/charts/ExpensesChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BudgetForm from "@/components/budget/BudgetForm";
import BudgetVsActualChart from "@/components/budget/BudgetVsActualChart";
import SpendingInsights from "@/components/budget/SpendingInsights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface CategorySummary {
    _id: string;
    name: string;
    color: string;
    totalAmount: number;
    percentage: number;
}

interface Budget {
    _id: string;
    category: Category;
    month: string;
    amount: number;
}

export default function Dashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryTotals, setCategoryTotals] = useState<CategorySummary[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [month] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
    });

    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch("/api/transactions");
            if (!response.ok) throw new Error("Failed to fetch transactions");
            const data: Transaction[] = await response.json();  // Specific type
            setTransactions(data);
        } catch (err: unknown) {
            setError((err as Error).message || "Unknown error");
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch("/api/categories");
            if (!response.ok) throw new Error("Failed to fetch categories");
            const data: Category[] = await response.json();  // Specific type
            setCategories(data);
        } catch (err: unknown) {  // Keep any for error
            console.error("Failed to fetch categories:", err);
        }
    }, []);

    const fetchBudgets = useCallback(async () => {
        try {
            const response = await fetch(`/api/budgets?month=${month}`);
            if (!response.ok) throw new Error("Failed to fetch budgets");
            const data: Budget[] = await response.json();  // Specific type
            setBudgets(data);
        } catch (err: unknown) {  // Keep unknown for error
            console.error("Failed to fetch budgets:", err);
        }
    }, [month]);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            fetchTransactions(),
            fetchCategories(),
            fetchBudgets(),
        ]).finally(() => setIsLoading(false));
    }, [fetchTransactions, fetchCategories, fetchBudgets]);

    useEffect(() => {
        if (transactions.length === 0 || categories.length === 0) {
            setCategoryTotals([]);
            return;
        }

        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat._id] = cat;
            return acc;
        }, {} as { [key: string]: Category });

        const categoryAmounts: { [key: string]: number } = {};

        transactions.forEach((transaction) => {
            let categoryId = "uncategorized";
            if (transaction.category && transaction.category._id) {
                categoryId = transaction.category._id;
            }
            if (!categoryAmounts[categoryId]) categoryAmounts[categoryId] = 0;
            categoryAmounts[categoryId] += transaction.amount;
        });

        const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

        const totals = Object.entries(categoryAmounts)
            .map(([categoryId, amount]) => {
                const category = categoryMap[categoryId];
                return {
                    _id: categoryId,
                    name: category ? category.name : "Uncategorized",
                    color: category ? category.color : "#CCCCCC",
                    totalAmount: amount,
                    percentage: (amount / totalAmount) * 100,
                };
            })
            .sort((a, b) => b.totalAmount - a.totalAmount);

        setCategoryTotals(totals);
    }, [transactions, categories]);

    const sortedByAmount = [...transactions].sort((a, b) => a.amount - b.amount);

    const sortedByDateDesc = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latestTransaction =
        sortedByDateDesc.length > 0 ? sortedByDateDesc[0] : null;

    const actuals = categoryTotals.map((cat) => ({
        category: cat.name,
        amount: cat.totalAmount,
    }));

    const budgetData = budgets.map((b) => ({
        category: b.category.name,
        amount: b.amount,
    }));

    const handleBudgetSave = async (categoryId: string, amount: number) => {
        setBudgets((prev) => {
            const index = prev.findIndex((b) => b.category._id === categoryId);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = { ...updated[index], amount };
                return updated;
            }
            return [
                ...prev,
                {
                    _id: "",
                    category: categories.find((c) => c._id === categoryId)!,
                    month,
                    amount,
                },
            ];
        });

        try {
            const res = await fetch("/api/budgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: categoryId, month, amount }),
            });
            if (!res.ok) throw new Error("Failed to save budget");

        } catch (error: unknown) {  // Keep unknown for error
            console.error(error);
        }
    };

    return (
        <main className="container max-w-6xl mx-auto py-8 px-4">
            <Header onTransactionAdded={fetchTransactions} />

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-muted-foreground">Loading data...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-6">
                    <p>Error: {error}</p>
                    <button
                        onClick={fetchTransactions}
                        className="text-sm underline mt-2"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="mb-8">
                        <SummaryCards
                            totalExpenses={transactions.reduce(
                                (sum, tx) => sum + tx.amount,
                                0
                            )}
                            categoryTotals={categoryTotals}
                            latestTransaction={latestTransaction}
                        />
                    </div>

                    {/* Budget Form */}
                    <div className="mb-8">
                        <BudgetForm
                            month={month}
                            onBudgetSave={handleBudgetSave}
                            onSuccess={() => {
                                fetchBudgets();
                            }}
                        />
                    </div>

                    {/* Budget vs Actual Chart */}
                    <div className="mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">
                                    Budget vs Actual Spending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BudgetVsActualChart budgets={budgetData} actuals={actuals} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Spending Insights */}
                    <SpendingInsights budgets={budgetData} actuals={actuals} />

                    {/* Expense Tabs */}
                    <br />
                    <div className="mb-8">
                        <Tabs defaultValue="expenses" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="expenses">Monthly Expenses</TabsTrigger>
                                <TabsTrigger value="categories">
                                    Category Distribution
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="expenses">
                                <CardContent className="text-center text-xl">
                                    <ExpensesChart transactions={sortedByAmount} />
                                </CardContent>
                            </TabsContent>
                            <TabsContent value="categories">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-center text-xl">Expenses by Category</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CategoryPieChart transactions={sortedByAmount} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Transaction List */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold mb-4 text-center">Transaction History</h2>
                        <TransactionList
                            transactions={sortedByAmount}
                            categories={categories}
                            onTransactionChange={fetchTransactions}
                        />
                    </div>
                </>
            )}

            <Toaster />
        </main>
    );
}
