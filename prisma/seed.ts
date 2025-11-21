import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...\n');

    // 1. Create Admin User
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@smmuh.com' },
        update: {},
        create: {
            email: 'admin@smmuh.com',
            password_hash: adminPassword,
            role: 'ADMIN',
            is_active: true
        }
    });
    console.log(`✅ Admin created: ${admin.email} (Password: admin123)\n`);

    // 2. Create Demo User
    console.log('👤 Creating demo user...');
    const demoPassword = await bcrypt.hash('demo123', 12);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            password_hash: demoPassword,
            role: 'USER',
            is_active: true
        }
    });
    console.log(`✅ Demo user created: ${demoUser.email} (Password: demo123)\n`);

    // 3. Create Wallets for Demo User
    console.log('💳 Creating wallets...');
    const wallets = await Promise.all([
        prisma.wallet.create({
            data: {
                name: 'Main Bank Account',
                type: 'BANK',
                balance: 5000,
                user_id: demoUser.id
            }
        }),
        prisma.wallet.create({
            data: {
                name: 'Cash Wallet',
                type: 'CASH',
                balance: 500,
                user_id: demoUser.id
            }
        }),
        prisma.wallet.create({
            data: {
                name: 'Credit Card',
                type: 'CREDIT_CARD',
                balance: -1200,
                user_id: demoUser.id
            }
        })
    ]);
    console.log(`✅ Created ${wallets.length} wallets\n`);

    // 4. Create Transaction Categories with Subcategories
    console.log('📁 Creating transaction categories...');

    // Expense Categories
    const foodCategory = await prisma.transactionCategory.create({
        data: {
            name: 'Food & Dining',
            type: 'EXPENSE',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Restaurants' },
                    { name: 'Groceries' },
                    { name: 'Fast Food' },
                    { name: 'Coffee & Tea' }
                ]
            }
        },
        include: { subCategories: true }
    });

    const transportCategory = await prisma.transactionCategory.create({
        data: {
            name: 'Transportation',
            type: 'EXPENSE',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Fuel' },
                    { name: 'Public Transport' },
                    { name: 'Parking' },
                    { name: 'Maintenance' }
                ]
            }
        },
        include: { subCategories: true }
    });

    const shoppingCategory = await prisma.transactionCategory.create({
        data: {
            name: 'Shopping',
            type: 'EXPENSE',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Clothing' },
                    { name: 'Electronics' },
                    { name: 'Home & Garden' },
                    { name: 'Personal Care' }
                ]
            }
        },
        include: { subCategories: true }
    });

    const utilitiesCategory = await prisma.transactionCategory.create({
        data: {
            name: 'Utilities',
            type: 'EXPENSE',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Electricity' },
                    { name: 'Water' },
                    { name: 'Internet' },
                    { name: 'Phone' }
                ]
            }
        },
        include: { subCategories: true }
    });

    // Income Categories
    const salaryCategory = await prisma.transactionCategory.create({
        data: {
            name: 'Salary',
            type: 'INCOME',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Main Job' },
                    { name: 'Bonus' },
                    { name: 'Overtime' }
                ]
            }
        },
        include: { subCategories: true }
    });

    const businessCategory = await prisma.transactionCategory.create({
        data: {
            name: 'Business Income',
            type: 'INCOME',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Freelance' },
                    { name: 'Consulting' },
                    { name: 'Sales' }
                ]
            }
        },
        include: { subCategories: true }
    });

    console.log(`✅ Created 6 transaction categories with subcategories\n`);

    // 5. Create Asset/Liability Categories
    console.log('🏦 Creating asset/liability categories...');

    const bankAssetCategory = await prisma.assetCategory.create({
        data: {
            name: 'Bank Accounts',
            type: 'ASSET',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Savings Account' },
                    { name: 'Checking Account' },
                    { name: 'Fixed Deposit' }
                ]
            }
        },
        include: { subCategories: true }
    });

    const investmentCategory = await prisma.assetCategory.create({
        data: {
            name: 'Investments',
            type: 'ASSET',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Stocks' },
                    { name: 'Bonds' },
                    { name: 'Mutual Funds' }
                ]
            }
        },
        include: { subCategories: true }
    });

    const loanLiabilityCategory = await prisma.assetCategory.create({
        data: {
            name: 'Loans',
            type: 'LIABILITY',
            user_id: demoUser.id,
            subCategories: {
                create: [
                    { name: 'Home Loan' },
                    { name: 'Car Loan' },
                    { name: 'Personal Loan' }
                ]
            }
        },
        include: { subCategories: true }
    });

    console.log(`✅ Created 3 asset/liability categories with subcategories\n`);

    // 6. Create Sample Transactions
    console.log('💰 Creating sample transactions...');

    const transactions = await Promise.all([
        prisma.transaction.create({
            data: {
                amount: 3000,
                date: new Date('2025-11-01'),
                description: 'Monthly Salary',
                type: 'INCOME',
                category_id: salaryCategory.id,
                sub_category_id: salaryCategory.subCategories[0].id,
                wallet_id: wallets[0].id,
                user_id: demoUser.id
            }
        }),
        prisma.transaction.create({
            data: {
                amount: 150,
                date: new Date('2025-11-05'),
                description: 'Grocery Shopping',
                type: 'EXPENSE',
                category_id: foodCategory.id,
                sub_category_id: foodCategory.subCategories[1].id,
                wallet_id: wallets[0].id,
                user_id: demoUser.id
            }
        }),
        prisma.transaction.create({
            data: {
                amount: 60,
                date: new Date('2025-11-10'),
                description: 'Gas Station',
                type: 'EXPENSE',
                category_id: transportCategory.id,
                sub_category_id: transportCategory.subCategories[0].id,
                wallet_id: wallets[1].id,
                user_id: demoUser.id
            }
        }),
        prisma.transaction.create({
            data: {
                amount: 45,
                date: new Date('2025-11-12'),
                description: 'Restaurant Dinner',
                type: 'EXPENSE',
                category_id: foodCategory.id,
                sub_category_id: foodCategory.subCategories[0].id,
                wallet_id: wallets[2].id,
                user_id: demoUser.id
            }
        })
    ]);

    console.log(`✅ Created ${transactions.length} sample transactions\n`);

    // 7. Create Parties
    console.log('👥 Creating parties...');
    const parties = await Promise.all([
        prisma.party.create({
            data: {
                name: 'John Doe',
                phone: '+1234567890',
                email: 'john@example.com',
                user_id: demoUser.id
            }
        }),
        prisma.party.create({
            data: {
                name: 'Jane Smith',
                phone: '+0987654321',
                email: 'jane@example.com',
                user_id: demoUser.id
            }
        })
    ]);
    console.log(`✅ Created ${parties.length} parties\n`);

    // 8. Create Sample Loan
    console.log('💵 Creating sample loan...');
    const loan = await prisma.loan.create({
        data: {
            type: 'LENT',
            amount: 1000,
            date: new Date('2025-11-01'),
            status: 'ACTIVE',
            party_id: parties[0].id,
            user_id: demoUser.id
        }
    });

    // Create loan transaction
    await prisma.loanTransaction.create({
        data: {
            loan_id: loan.id,
            party_id: parties[0].id,
            wallet_id: wallets[0].id,
            amount: 1000,
            type: 'GIVEN',
            date: new Date('2025-11-01'),
            description: 'Loan given to John'
        }
    });

    console.log(`✅ Created sample loan with transaction\n`);

    // 9. Create Sample Assets
    console.log('🏠 Creating sample assets...');
    await Promise.all([
        prisma.assetLiability.create({
            data: {
                name: 'Savings Account - Bank A',
                type: 'ASSET',
                value: 10000,
                category_id: bankAssetCategory.id,
                sub_category_id: bankAssetCategory.subCategories[0].id,
                user_id: demoUser.id
            }
        }),
        prisma.assetLiability.create({
            data: {
                name: 'Car Loan',
                type: 'LIABILITY',
                value: 15000,
                category_id: loanLiabilityCategory.id,
                sub_category_id: loanLiabilityCategory.subCategories[1].id,
                user_id: demoUser.id
            }
        })
    ]);

    console.log(`✅ Created sample assets/liabilities\n`);

    console.log('✨ Seeding completed successfully!\n');
    console.log('📝 Login Credentials:');
    console.log('   Admin: admin@smmuh.com / admin123');
    console.log('   Demo:  demo@example.com / demo123\n');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
