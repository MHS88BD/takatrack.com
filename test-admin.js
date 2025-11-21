const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function testAdmin() {
    console.log('👮 ADMIN SYSTEM TEST\n');

    try {
        // 1. Login as Admin
        console.log('1️⃣  ADMIN LOGIN');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@smmuh.com',
            password: 'admin123'
        });
        const token = loginRes.data.token;
        console.log('   ✅ Admin login successful');

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Get System Stats
        console.log('\n2️⃣  SYSTEM STATS');
        const statsRes = await axios.get(`${API_URL}/admin/stats`, config);
        console.log('   ✅ Stats retrieved:');
        console.log(JSON.stringify(statsRes.data.data.stats, null, 2));

        // 3. Get All Users
        console.log('\n3️⃣  GET ALL USERS');
        const usersRes = await axios.get(`${API_URL}/admin/users`, config);
        console.log(`   ✅ Found ${usersRes.data.results} users`);

        const demoUser = usersRes.data.data.users.find(u => u.email === 'demo@example.com');
        if (demoUser) {
            console.log('   👤 Found demo user:', demoUser.email);

            // 4. Get User Details
            console.log('\n4️⃣  GET USER DETAILS');
            const detailsRes = await axios.get(`${API_URL}/admin/users/${demoUser.id}`, config);
            console.log('   ✅ User details retrieved');
            console.log(`   💰 Wallets: ${detailsRes.data.data.user.wallets.length}`);
            console.log(`   📝 Transactions: ${detailsRes.data.data.user._count.transactions}`);
        } else {
            console.log('   ❌ Demo user not found in list');
        }

        console.log('\n✨ ADMIN TESTS PASSED! ✨');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.response ? error.response.data : error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
    }
}

testAdmin();
