const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testWalletSystem() {
    try {
        console.log('🧪 Testing Minimal Wallet System\n');

        // 1. Login as demo user
        console.log('1️⃣  Logging in as demo user...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'demo@example.com',
            password: 'demo123'
        });
        const token = loginRes.data.token;
        console.log('✅ Login successful\n');

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Get all wallets
        console.log('2️⃣  Getting all wallets...');
        const walletsRes = await axios.get(`${API_URL}/wallets`, config);
        console.log(`✅ Found ${walletsRes.data.results} wallets:`);
        walletsRes.data.data.wallets.forEach(w => {
            console.log(`   - ${w.name} (${w.type}): $${w.balance}`);
        });
        console.log();

        // 3. Get wallet summary
        console.log('3️⃣  Getting wallet summary...');
        const summaryRes = await axios.get(`${API_URL}/wallets/summary`, config);
        const summary = summaryRes.data.data;
        console.log(`✅ Wallet Summary:`);
        console.log(`   Total Wallets: ${summary.totalWallets}`);
        console.log(`   Total Balance: $${summary.totalBalance}`);
        console.log(`   Bank Balance: $${summary.bankBalance}`);
        console.log(`   Cash Balance: $${summary.cashBalance}`);
        console.log(`   Credit Balance: $${summary.creditBalance}`);
        console.log();

        // 4. Create new wallet
        console.log('4️⃣  Creating new wallet...');
        const newWalletRes = await axios.post(`${API_URL}/wallets`, {
            name: 'Savings Account',
            type: 'BANK',
            balance: 2000
        }, config);
        const newWallet = newWalletRes.data.data.wallet;
        console.log(`✅ Created wallet: ${newWallet.name} with balance $${newWallet.balance}`);
        console.log();

        // 5. Get single wallet
        console.log('5️⃣  Getting wallet details...');
        const walletRes = await axios.get(`${API_URL}/wallets/${newWallet.id}`, config);
        console.log(`✅ Wallet details retrieved: ${walletRes.data.data.wallet.name}`);
        console.log();

        // 6. Update wallet
        console.log('6️⃣  Updating wallet balance...');
        const updateRes = await axios.put(`${API_URL}/wallets/${newWallet.id}`, {
            balance: 2500
        }, config);
        console.log(`✅ Updated balance to $${updateRes.data.data.wallet.balance}`);
        console.log();

        // 7. Get updated summary
        console.log('7️⃣  Getting updated summary...');
        const newSummaryRes = await axios.get(`${API_URL}/wallets/summary`, config);
        const newSummary = newSummaryRes.data.data;
        console.log(`✅ New Total Balance: $${newSummary.totalBalance}`);
        console.log();

        console.log('✨ ALL WALLET TESTS PASSED! ✨\n');
        console.log('🎯 Wallet System Status:');
        console.log('   ✅ Authentication working');
        console.log('   ✅ Get all wallets working');
        console.log('   ✅ Get wallet summary working');
        console.log('   ✅ Create wallet working');
        console.log('   ✅ Get single wallet working');
        console.log('   ✅ Update wallet working');
        console.log('\n🚀 Ready to build frontend wallet page!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response ? error.response.data : error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
    }
}

testWalletSystem();
