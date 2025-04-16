import { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash } from 'lucide-react';
import TransactionForm from './TransactionForm';

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
  category: Category | string | null;
}

interface TransactionForForm {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  categories?: Category[];
  onTransactionChange: () => void;
}

export default function TransactionList({
  transactions,
  categories = [],
  onTransactionChange,
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<TransactionForForm | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const sortedTransactions = [...transactions].sort((a, b) => a.amount - b.amount);

  const handleEdit = (transaction: Transaction) => {
    const transformedTransaction: TransactionForForm = {
      ...transaction,
      category:
        typeof transaction.category === "string"
          ? transaction.category
          : transaction.category?._id ?? "",
    };
    setEditingTransaction(transformedTransaction);
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/transactions/${transactionToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      toast.success('Transaction deleted', {
        description: 'Your transaction has been deleted successfully.',
      });

      onTransactionChange();
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const getCategoryName = (transaction: Transaction) => {
    if (!transaction.category) return "Uncategorized";

    if (typeof transaction.category === "string") {
      const cat = categories.find((c) => c._id === transaction.category);
      return cat ? cat.name : "Uncategorized";
    }

    return transaction.category.name;
  };

  return (
    <>
      <div className="rounded-md border shadow-slate-300 shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No transactions found. Add a transaction to get started.
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell>
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{getCategoryName(transaction)}</TableCell>
                  <TableCell className="text-right">₹{transaction.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => confirmDelete(transaction._id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Transaction Dialog */}
      <Dialog
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {editingTransaction && (
            <TransactionForm
              initialData={editingTransaction}
              onSuccess={() => {
                setEditingTransaction(null);
                onTransactionChange();
              }}
              onCancel={() => setEditingTransaction(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
