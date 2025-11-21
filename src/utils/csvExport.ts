import { createObjectCsvStringifier } from 'csv-writer';

interface Transaction {
    id: string;
    type: string;
    amount: number;
    description?: string;
    date: Date;
    category?: { name: string };
    wallet?: { name: string };
}

interface Wallet {
    id: string;
    name: string;
    type: string;
    balance: number;
    created_at: Date;
}

interface Loan {
    id: string;
    party_name: string;
    amount: number;
    type: string;
    status: string;
    interest_rate?: number;
    due_date?: Date;
    wallet?: { name: string };
}

interface Category {
    id: string;
    name: string;
    type: string;
    parent?: { name: string };
    _count?: { transactions: number };
}

export const generateTransactionsCSV = (transactions: Transaction[]): string => {
    const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: 'date', title: 'Date' },
            { id: 'type', title: 'Type' },
            { id: 'amount', title: 'Amount' },
            { id: 'category', title: 'Category' },
            { id: 'wallet', title: 'Wallet' },
            { id: 'description', title: 'Description' },
        ],
    });

    const records = transactions.map((transaction) => ({
        date: new Date(transaction.date).toLocaleDateString(),
        type: transaction.type,
        amount: transaction.amount.toFixed(2),
        category: transaction.category?.name || 'N/A',
        wallet: transaction.wallet?.name || 'N/A',
        description: transaction.description || '',
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
};

export const generateWalletsCSV = (wallets: Wallet[]): string => {
    const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: 'name', title: 'Name' },
            { id: 'type', title: 'Type' },
            { id: 'balance', title: 'Balance' },
            { id: 'created_at', title: 'Created At' },
        ],
    });

    const records = wallets.map((wallet) => ({
        name: wallet.name,
        type: wallet.type,
        balance: wallet.balance.toFixed(2),
        created_at: new Date(wallet.created_at).toLocaleDateString(),
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
};

export const generateLoansCSV = (loans: Loan[]): string => {
    const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: 'party_name', title: 'Party Name' },
            { id: 'type', title: 'Type' },
            { id: 'amount', title: 'Amount' },
            { id: 'status', title: 'Status' },
            { id: 'interest_rate', title: 'Interest Rate (%)' },
            { id: 'due_date', title: 'Due Date' },
            { id: 'wallet', title: 'Wallet' },
        ],
    });

    const records = loans.map((loan) => ({
        party_name: loan.party_name,
        type: loan.type,
        amount: loan.amount.toFixed(2),
        status: loan.status,
        interest_rate: loan.interest_rate?.toFixed(2) || 'N/A',
        due_date: loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A',
        wallet: loan.wallet?.name || 'N/A',
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
};

export const generateCategoriesCSV = (categories: Category[]): string => {
    const csvStringifier = createObjectCsvStringifier({
        header: [
            { id: 'name', title: 'Name' },
            { id: 'type', title: 'Type' },
            { id: 'parent', title: 'Parent Category' },
            { id: 'transaction_count', title: 'Transaction Count' },
        ],
    });

    const records = categories.map((category) => ({
        name: category.name,
        type: category.type,
        parent: category.parent?.name || 'N/A',
        transaction_count: category._count?.transactions || 0,
    }));

    return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
};
