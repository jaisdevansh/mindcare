const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb+srv://aryajaiswal744_db_user:e617JasU5dcF8Nok@mind.354hf7z.mongodb.net/?appName=mind';

const newAdmins = [
    { name: 'Divyanshu', email: 'divyanshu2213024@akgec.ac.in' },
    { name: 'Aryan', email: 'aryan2213183@akgec.ac.in' },
];

async function createAdmins() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db();
        const users = db.collection('users');

        const hashedPassword = await bcrypt.hash('MindCare@2026', 10);

        for (const admin of newAdmins) {
            const existing = await users.findOne({ email: admin.email });
            if (existing) {
                await users.updateOne({ email: admin.email }, { $set: { role: 'admin' } });
                console.log(`✅ ${admin.email} → already exists, promoted to admin`);
            } else {
                await users.insertOne({
                    name: admin.name,
                    email: admin.email,
                    password: hashedPassword,
                    role: 'admin',
                    profileImage: '',
                    anonymousMode: false,
                    isVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                console.log(`✅ ${admin.email} → account created as admin`);
            }
        }

        console.log('\nDone! Default password: MindCare@2026');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.close();
    }
}

createAdmins();
