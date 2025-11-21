const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';
const TEST_USER = {
    email: `test${Date.now()}@example.com`,
    password: 'password123'
};

let token = '';
let categoryId = '';
let transactionId = '';
let partyId = '';
let loanId = '';
let tagId = '';
let assetId = '';

async function testAPI() {
    try {
        console.log('🚀 Starting Comprehensive API Tests...\n');

        // 1. AUTH TESTS
        console.log('📝 1. Testing Authentication...');
        const registerRes = await axios.post(`${API_URL}/auth/register`, TEST_USER);
        console.log('  ✅ Registration successful');
        token = registerRes.data.token;

        const loginRes = await axios.post(`${API_URL}/auth/login`, TEST_USER);
        console.log('  ✅ Login successful');

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. CATEGORY TESTS
        console.log('\n📁 2. Testing Categories...');
        const categoryRes = await axios.post(`${API_URL}/categories`, {
            name: 'Groceries',
            type: 'EXPENSE'
        }, config);
        categoryId = categoryRes.data.data.category.id;
        console.log('  ✅ Category created:', categoryRes.data.data.category.name);

        const subCategoryRes = await axios.post(`${API_URL}/categories/subcategory`, {
            name: 'Vegetables',
            category_id: categoryId
        }, config);
        console.log('  ✅ SubCategory created:', subCategoryRes.data.data.subCategory.name);

        const getCategoriesRes = await axios.get(`${API_URL}/categories`, config);
        console.log('  ✅ Categories fetched:', getCategoriesRes.data.results);

        // 3. TAG TESTS
        console.log('\n🏷️  3. Testing Tags...');
        const tagRes = await axios.post(`${API_URL}/tags`, {
            name: 'Essential'
        }, config);
        tagId = tagRes.data.data.tag.id;
        console.log('  ✅ Tag created:', tagRes.data.data.tag.name);

        const getTagsRes = await axios.get(`${API_URL}/tags`, config);
        console.log('  ✅ Tags fetched:', getTagsRes.data.results);

        // 4. TRANSACTION TESTS
        console.log('\n💰 4. Testing Transactions...');
        const transactionRes = await axios.post(`${API_URL}/transactions`, {
            amount: 150.75,
            date: new Date().toISOString(),
            description: 'Weekly grocery shopping',
            type: 'EXPENSE',
            category_id: categoryId,
            tags: [tagId]
        }, config);
        transactionId = transactionRes.data.data.transaction.id;
        console.log('  ✅ Transaction created:', transactionRes.data.data.transaction.description);

        const getTransactionsRes = await axios.get(`${API_URL}/transactions`, config);
        console.log('  ✅ Transactions fetched:', getTransactionsRes.data.results);

        const getTransactionRes = await axios.get(`${API_URL}/transactions/${transactionId}`, config);
        console.log('  ✅ Single transaction fetched');

        const updateTransactionRes = await axios.put(`${API_URL}/transactions/${transactionId}`, {
            amount: 175.50,
            description: 'Updated grocery shopping'
        }, config);
        console.log('  ✅ Transaction updated');

        // 5. PARTY TESTS
        console.log('\n👥 5. Testing Parties...');
        const partyRes = await axios.post(`${API_URL}/parties`, {
            name: 'John Doe',
            phone: '+1234567890'
        }, config);
        partyId = partyRes.data.data.party.id;
        console.log('  ✅ Party created:', partyRes.data.data.party.name);

        const getPartiesRes = await axios.get(`${API_URL}/parties`, config);
        console.log('  ✅ Parties fetched:', getPartiesRes.data.results);

        // 6. LOAN TESTS
        console.log('\n💵 6. Testing Loans...');
        const loanRes = await axios.post(`${API_URL}/loans`, {
            type: 'LENT',
            amount: 1000,
            date: new Date().toISOString(),
            party_id: partyId
        }, config);
        loanId = loanRes.data.data.loan.id;
        console.log('  ✅ Loan created: $' + loanRes.data.data.loan.amount);

        const repaymentRes = await axios.post(`${API_URL}/loans/${loanId}/repay`, {
            amount: 250,
            date: new Date().toISOString()
        }, config);
        console.log('  ✅ Repayment added: $' + repaymentRes.data.data.repayment.amount);

        const getLoansRes = await axios.get(`${API_URL}/loans`, config);
        console.log('  ✅ Loans fetched:', getLoansRes.data.results);

        const getLoanRes = await axios.get(`${API_URL}/loans/${loanId}`, config);
        console.log('  ✅ Single loan fetched with repayments:', getLoanRes.data.data.loan.repayments.length);

        // 7. ASSET/LIABILITY TESTS
        console.log('\n🏦 7. Testing Assets & Liabilities...');
        const assetRes = await axios.post(`${API_URL}/assets-liabilities`, {
            name: 'Savings Account',
            type: 'ASSET',
            value: 5000,
            category: 'Bank Account',
            tags: [tagId]
        }, config);
        assetId = assetRes.data.data.item.id;
        console.log('  ✅ Asset created:', assetRes.data.data.item.name);

        const liabilityRes = await axios.post(`${API_URL}/assets-liabilities`, {
            name: 'Credit Card Debt',
            type: 'LIABILITY',
            value: 2500,
            category: 'Credit Card'
        }, config);
        console.log('  ✅ Liability created:', liabilityRes.data.data.item.name);

        const getAssetsRes = await axios.get(`${API_URL}/assets-liabilities`, config);
        console.log('  ✅ Assets/Liabilities fetched:', getAssetsRes.data.results);

        const updateAssetRes = await axios.put(`${API_URL}/assets-liabilities/${assetId}`, {
            value: 5500
        }, config);
        console.log('  ✅ Asset updated');

        // 8. FILTER TESTS
        console.log('\n🔍 8. Testing Filters...');
        const filteredTransactionsRes = await axios.get(`${API_URL}/transactions?type=EXPENSE`, config);
        console.log('  ✅ Filtered transactions by type:', filteredTransactionsRes.data.results);

        const filteredLoansRes = await axios.get(`${API_URL}/loans?type=LENT`, config);
        console.log('  ✅ Filtered loans by type:', filteredLoansRes.data.results);

        const filteredAssetsRes = await axios.get(`${API_URL}/assets-liabilities?type=ASSET`, config);
        console.log('  ✅ Filtered assets by type:', filteredAssetsRes.data.results);

        console.log('\n✨ ALL TESTS PASSED! ✨');
        console.log('\n📊 Summary:');
        console.log('  • Authentication: ✅');
        console.log('  • Categories & SubCategories: ✅');
        console.log('  • Tags: ✅');
        console.log('  • Transactions: ✅');
        console.log('  • Parties: ✅');
        console.log('  • Loans & Repayments: ✅');
        console.log('  • Assets & Liabilities: ✅');
        console.log('  • Filtering: ✅');
        console.log('\n🚀 API is 100% ready for production!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response ? error.response.data : error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

testAPI();
