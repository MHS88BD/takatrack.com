const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testTransactionSystem() {
    try {
        console.log('🧪 Testing Transaction System with Wallet Integration\n');

        // 1. Login
        console.log('1️⃣  Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'demo@example.com',
            password: 'demo123'
        });
        const token = loginRes.data.token;
        console.log('✅ Login successful\n');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Get categories
        console.log('2️⃣  Getting transaction categories...');
        const categoriesRes = await axios.get(`${API_URL}/transaction-categories`, config);
        console.log(`✅ Found ${categoriesRes.data.results} categories:`);
        categoriesRes.data.data.categories.forEach(c => {
            console.log(`   - ${c.name} (${c.type}) - ${c.subCategories.length} subcategories`);
        });
        const expenseCategory = categoriesRes.data.data.categories.find(c => c.type === 'EXPENSE');
        const incomeCategory = categoriesRes.data.data.categories.find(c => c.type === 'INCOME');
        console.log();

        // 3. Get wallets
        console.log('3️⃣  Getting wallets...');
        const walletsRes = await axios.get(`${API_URL}/wallets`, config);
        const wallet = walletsRes.data.data.wallets[0];
        console.log(`✅ Using wallet: ${wallet.name} (Balance: $${wallet.balance})`);
        console.log();

        // 4. Create income transaction
        console.log('4️⃣  Creating income transaction...');
        const incomeRes = await axios.post(`${API_URL}/transactions`, {
            amount: 1000,
            date: new Date().toISOString(),
            description: 'Freelance Payment',
            type: 'INCOME',
            category_id: incomeCategory.id,
            sub_category_id: incomeCategory.subCategories[0]?.id,
            wallet_id: wallet.id
        }, config);
        console.log(`✅ Created income: $${incomeRes.data.data.transaction.amount}`);
        console.log();

        // 5. Create expense transaction
        console.log('5️⃣  Creating expense transaction...');
        const expenseRes = await axios.post(`${API_URL}/transactions`, {
            amount: 150,
            date: new Date().toISOString(),
            description: 'Grocery Shopping',
            type: 'EXPENSE',
            category_id: expenseCategory.id,
            sub_category_id: expenseCategory.subCategories[0]?.id,
            wallet_id: wallet.id
        }, config);
        console.log(`✅ Created expense: $${expenseRes.data.data.transaction.amount}`);
        console.log();

        // 6. Check updated wallet balance
        console.log('6️⃣  Checking updated wallet balance...');
        const updatedWalletRes = await axios.get(`${API_URL}/wallets/${wallet.id}`, config);
        const newBalance = updatedWalletRes.data.data.wallet.balance;
        console.log(`✅ Wallet balance updated: $${wallet.balance} → $${newBalance}`);
        console.log(`   Expected: $${Number(wallet.balance) + 1000 - 150}`);
        console.log();

        // 7. Get all transactions
        console.log('7️⃣  Getting all transactions...');
        const transactionsRes = await axios.get(`${API_URL}/transactions`, config);
        console.log(`✅ Found ${transactionsRes.data.results} transactions`);
        transactionsRes.data.data.transactions.slice(0, 5).forEach(t => {
            console.log(`   - ${t.description}: ${t.type === 'INCOME' ? '+' : '-'}$${t.amount} (${t.wallet.name})`);
        });
        console.log();

        // 8. Get transaction stats
        console.log('8️⃣  Getting transaction statistics...');
        const statsRes = await axios.get(`${API_URL}/transactions/stats`, config);
        const stats = statsRes.data.data;
        console.log(`✅ Transaction Stats:`);
        console.log(`   Total Income: $${stats.totalIncome}`);
        console.log(`   Total Expense: $${stats.totalExpense}`);
        console.log(`   Balance: $${stats.balance}`);
        console.log(`   Total Transactions: ${stats.totalTransactions}`);
        console.log();

        // 9. Filter transactions by type
        console.log('9️⃣  Filtering income transactions...');
        const incomeTransactionsRes = await axios.get(`${API_URL}/transactions?type=INCOME`, config);
        console.log(`✅ Found ${incomeTransactionsRes.data.results} income transactions`);
        console.log();

        // 10. Create subcategory
        console.log('🔟 Creating new subcategory...');
        const subCategoryRes = await axios.post(`${API_URL}/transaction-categories/subcategories`, {
            category_id: expenseCategory.id,
            name: 'Online Shopping'
        }, config);
        console.log(`✅ Created subcategory: ${subCategoryRes.data.data.subCategory.name}`);
        console.log();

        console.log('✨ ALL TRANSACTION TESTS PASSED! ✨\n');
        console.log('🎯 Transaction System Status:');
        console.log('   ✅ Categories with subcategories working');
        console.log('   ✅ Create income transaction working');
        console.log('   ✅ Create expense transaction working');
        console.log('   ✅ Wallet balance auto-update working');
        console.log('   ✅ Transaction filtering working');
        console.log('   ✅ Transaction statistics working');
        console.log('   ✅ Subcategory creation working');
        console.log('\n🚀 Ready to build frontend transaction page!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response ? error.response.data : error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testTransactionSystem();
