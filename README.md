# Personal Finance Visualizer

A simple web application for tracking personal finances and visualizing spending patterns with intuitive charts and categorization.

## Features

### Stage 1: Basic Transaction Tracking
- Add, edit, and delete transactions with amount, date, and description
- Comprehensive transaction list view with sorting capability
- Monthly expenses bar chart for visual spending tracking
- Form validation to ensure data integrity

### Stage 2: Categories
- All Stage 1 features plus:
- Predefined categories for transaction organization
- Interactive pie chart showing spending by category
- Dashboard with summary cards displaying:
  - Total expenses
  - Category breakdown
  - Most recent transactions

### Stage 3: Budgeting (Coming soon)
- Set monthly category budgets
- Budget vs actual comparison charts
- Personalized spending insights

## Tech Stack

- **Frontend**: Next.js, React
- **UI Components**: shadcn/ui
- **Data Visualization**: Recharts
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Notifications**: Sonner for toast notifications
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/personal-finance-visualizer.git
cd personal-finance-visualizer
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment

This application is deployed on Vercel. The live version can be accessed at [https://personal-finance-visualizer-abhay-joshi.vercel.app/](https://personal-finance-visualizer-abhay-joshi.vercel.app/)

### How to deploy your own instance:

1. Fork this repository
2. Create a Vercel account if you don't have one
3. Import your repository to Vercel
4. Add your MongoDB URI as an environment variable
5. Deploy

## Usage Guide

### Adding a Transaction
1. Click the "Add Transaction" button on the top right
2. Fill in the amount, date, description, and category
3. Click "Add" to save the transaction

### Editing a Transaction
1. Find the transaction in the list
2. Click the pencil icon
3. Modify the details
4. Click "Update"

### Deleting a Transaction
1. Locate the transaction in the list
2. Click the trash icon
3. Confirm deletion in the dialog

### Viewing Charts
- The monthly expenses bar chart displays spending over time
- The category pie chart shows the proportion of spending in each category

## Project Structure

``` /
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── .env.local
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── api/
    │   │   ├── budgets/
    │   │   │   └── route.ts
    │   │   ├── categories/
    │   │   │   └── route.ts
    │   │   └── transactions/
    │   │       ├── route.ts
    │   │       └── [id]/
    │   │           └── route.ts
    │   └── dashboard/
    │       └── page.tsx
    ├── components/
    │   ├── Header.tsx
    │   ├── budget/
    │   │   ├── BudgetForm.tsx
    │   │   ├── BudgetVsActualChart.tsx
    │   │   └── SpendingInsights.tsx
    │   ├── charts/
    │   │   ├── CategoryPieChart.tsx
    │   │   └── ExpensesChart.tsx
    │   ├── dashboard/
    │   │   └── SummaryCards.tsx
    │   ├── transactions/
    │   │   ├── TransactionForm.tsx
    │   │   └── TransactionList.tsx
    │   └── ui/
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── dialog.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── table.tsx
    │       └── tabs.tsx
    ├── lib/
    │   ├── db.ts
    │   ├── seed-categories.ts
    │   ├── utils.ts
    │   └── validations.ts
    ├── models/
    │   ├── Budget.ts
    │   ├── Category.ts
    │   └── Transaction.ts
    └── public/

```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library
- [Next.js](https://nextjs.org/) for the React framework
- [MongoDB](https://www.mongodb.com/) for the database