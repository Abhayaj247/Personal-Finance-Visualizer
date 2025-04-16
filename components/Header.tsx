import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import TransactionForm from './transactions/TransactionForm';

interface HeaderProps {
  onTransactionAdded: () => void;
}

export default function Header({ onTransactionAdded }: HeaderProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <header className="border-b pb-5 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage your personal finances</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSuccess={() => {
              setIsAddDialogOpen(false);
              onTransactionAdded();
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </header>
  );
}