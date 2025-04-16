"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BudgetSchema, BudgetFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

interface Category {
    _id: string;
    name: string;
    color: string;
}

interface BudgetFormProps {
    month: string;
    onSuccess?: () => void;
    onBudgetSave: (categoryId: string, amount: number) => Promise<void>;
}

export default function BudgetForm({ month, onSuccess, onBudgetSave }: BudgetFormProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch("/api/categories");
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (err: any) {
                console.error("Failed to fetch categories", err);
            }
        }
        fetchCategories();
    }, []);

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(BudgetSchema),
        defaultValues: {
            category: "",
            amount: 0,
        },
    });

    async function onSubmit(data: BudgetFormValues) {
        setIsLoading(true);

        try {
            if (onBudgetSave) {
                await onBudgetSave(data.category, data.amount);
                toast.success("Budget saved successfully!");
                form.reset();
                if (onSuccess) onSuccess();
            } else {
                throw new Error("onBudgetSave function is not provided");
            }


        } catch (err: any) {
            toast.error("Error saving budget", {
                description: err.message || "Something went wrong",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-4 border rounded-md shadow-sm max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">
                Set Budget for {month}
            </h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Category Field */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <select
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        disabled={isLoading}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Amount Field */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter budget amount"
                                        value={field.value ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const numberValue = value === "" ? 0 : parseFloat(value);
                                            field.onChange(numberValue);
                                        }}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Budget"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
