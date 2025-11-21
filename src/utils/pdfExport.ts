import PDFDocument from 'pdfkit';
import { Response } from 'express';

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

interface ReportData {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    totalWalletBalance: number;
    totalLoansLent: number;
    totalLoansBorrowed: number;
    categoryBreakdown: { category: string; amount: number; percentage: number }[];
    transactions: Transaction[];
}

export const generateTransactionsPDF = (transactions: Transaction[], res: Response): void => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Transaction Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Table Header
    const tableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Date', 50, tableTop, { width: 80 });
    doc.text('Type', 130, tableTop, { width: 70 });
    doc.text('Amount', 200, tableTop, { width: 80 });
    doc.text('Category', 280, tableTop, { width: 100 });
    doc.text('Wallet', 380, tableTop, { width: 100 });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.moveDown();

    // Table Rows
    doc.font('Helvetica');
    let y = tableTop + 25;

    transactions.forEach((transaction, index) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        doc.text(new Date(transaction.date).toLocaleDateString(), 50, y, { width: 80 });
        doc.text(transaction.type, 130, y, { width: 70 });
        doc.text(`$${transaction.amount.toFixed(2)}`, 200, y, { width: 80 });
        doc.text(transaction.category?.name || 'N/A', 280, y, { width: 100 });
        doc.text(transaction.wallet?.name || 'N/A', 380, y, { width: 100 });

        y += 20;
    });

    // Summary
    doc.moveDown(2);
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`);
    doc.text(`Total Expense: $${totalExpense.toFixed(2)}`);
    doc.text(`Net: $${(totalIncome - totalExpense).toFixed(2)}`);

    doc.end();
};

export const generateWalletsPDF = (wallets: Wallet[], res: Response): void => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=wallets.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Wallets Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Table Header
    const tableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Name', 50, tableTop, { width: 150 });
    doc.text('Type', 200, tableTop, { width: 100 });
    doc.text('Balance', 300, tableTop, { width: 100 });
    doc.text('Created At', 400, tableTop, { width: 150 });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.moveDown();

    // Table Rows
    doc.font('Helvetica');
    let y = tableTop + 25;

    wallets.forEach((wallet) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        doc.text(wallet.name, 50, y, { width: 150 });
        doc.text(wallet.type, 200, y, { width: 100 });
        doc.text(`$${wallet.balance.toFixed(2)}`, 300, y, { width: 100 });
        doc.text(new Date(wallet.created_at).toLocaleDateString(), 400, y, { width: 150 });

        y += 20;
    });

    // Summary
    doc.moveDown(2);
    const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Total Balance: $${totalBalance.toFixed(2)}`);
    doc.text(`Number of Wallets: ${wallets.length}`);

    doc.end();
};

export const generateLoansPDF = (loans: Loan[], res: Response): void => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=loans.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Loans Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Table Header
    const tableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Party', 50, tableTop, { width: 100 });
    doc.text('Type', 150, tableTop, { width: 70 });
    doc.text('Amount', 220, tableTop, { width: 80 });
    doc.text('Status', 300, tableTop, { width: 70 });
    doc.text('Interest', 370, tableTop, { width: 60 });
    doc.text('Due Date', 430, tableTop, { width: 120 });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.moveDown();

    // Table Rows
    doc.font('Helvetica');
    let y = tableTop + 25;

    loans.forEach((loan) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        doc.text(loan.party_name, 50, y, { width: 100 });
        doc.text(loan.type, 150, y, { width: 70 });
        doc.text(`$${loan.amount.toFixed(2)}`, 220, y, { width: 80 });
        doc.text(loan.status, 300, y, { width: 70 });
        doc.text(loan.interest_rate ? `${loan.interest_rate}%` : 'N/A', 370, y, { width: 60 });
        doc.text(loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A', 430, y, { width: 120 });

        y += 20;
    });

    // Summary
    doc.moveDown(2);
    const totalLent = loans.filter(l => l.type === 'LENT').reduce((sum, l) => sum + l.amount, 0);
    const totalBorrowed = loans.filter(l => l.type === 'BORROWED').reduce((sum, l) => sum + l.amount, 0);

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`Total Lent: $${totalLent.toFixed(2)}`);
    doc.text(`Total Borrowed: $${totalBorrowed.toFixed(2)}`);
    doc.text(`Net Position: $${(totalLent - totalBorrowed).toFixed(2)}`);

    doc.end();
};

export const generateFinancialReportPDF = (data: ReportData, res: Response): void => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=financial-report.pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(24).text('Financial Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Summary Section
    doc.fontSize(16).font('Helvetica-Bold').text('Financial Summary');
    doc.moveDown();
    doc.fontSize(12).font('Helvetica');

    doc.text(`Total Income: $${data.totalIncome.toFixed(2)}`);
    doc.text(`Total Expense: $${data.totalExpense.toFixed(2)}`);
    doc.text(`Net Savings: $${data.netSavings.toFixed(2)}`);
    doc.text(`Total Wallet Balance: $${data.totalWalletBalance.toFixed(2)}`);
    doc.text(`Total Loans Lent: $${data.totalLoansLent.toFixed(2)}`);
    doc.text(`Total Loans Borrowed: $${data.totalLoansBorrowed.toFixed(2)}`);
    doc.moveDown(2);

    // Category Breakdown
    doc.fontSize(16).font('Helvetica-Bold').text('Expense by Category');
    doc.moveDown();

    const tableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Category', 50, tableTop, { width: 200 });
    doc.text('Amount', 250, tableTop, { width: 100 });
    doc.text('Percentage', 350, tableTop, { width: 100 });

    doc.moveTo(50, tableTop + 15).lineTo(450, tableTop + 15).stroke();

    doc.font('Helvetica');
    let y = tableTop + 25;

    data.categoryBreakdown.forEach((item) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        doc.text(item.category, 50, y, { width: 200 });
        doc.text(`$${item.amount.toFixed(2)}`, 250, y, { width: 100 });
        doc.text(`${item.percentage.toFixed(1)}%`, 350, y, { width: 100 });

        y += 20;
    });

    // Recent Transactions
    doc.addPage();
    doc.fontSize(16).font('Helvetica-Bold').text('Recent Transactions');
    doc.moveDown();

    const transTableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Date', 50, transTableTop, { width: 80 });
    doc.text('Type', 130, transTableTop, { width: 70 });
    doc.text('Amount', 200, transTableTop, { width: 80 });
    doc.text('Category', 280, transTableTop, { width: 120 });

    doc.moveTo(50, transTableTop + 15).lineTo(400, transTableTop + 15).stroke();

    doc.font('Helvetica');
    y = transTableTop + 25;

    data.transactions.slice(0, 20).forEach((transaction) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        doc.text(new Date(transaction.date).toLocaleDateString(), 50, y, { width: 80 });
        doc.text(transaction.type, 130, y, { width: 70 });
        doc.text(`$${transaction.amount.toFixed(2)}`, 200, y, { width: 80 });
        doc.text(transaction.category?.name || 'N/A', 280, y, { width: 120 });

        y += 20;
    });

    doc.end();
};
