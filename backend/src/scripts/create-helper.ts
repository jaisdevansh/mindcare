/**
 * One-time seed script: Creates a verified helper account.
 * Run: npx ts-node src/scripts/create-helper.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindcare';

const helperSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    verified: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: true },
}, { timestamps: true });

const Helper = mongoose.models.Helper || mongoose.model('Helper', helperSchema);

async function run() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'devansh2213093@akgec.ac.in';
    const password = '123456789';
    const name = 'Devansh (Helper)';

    // Remove existing if any
    await Helper.deleteOne({ email });
    console.log('🗑️  Removed any existing account with this email');

    const hashed = await bcrypt.hash(password, 10);

    const helper = new Helper({
        name,
        email,
        password: hashed,
        bio: 'Experienced mental wellness helper.',
        skills: ['Anxiety', 'Stress', 'Depression'],
        experienceYears: 2,
        rating: 4.5,
        verified: true,
        isVerified: true,
    });

    await helper.save();
    console.log(`✅ Helper account created!`);
    console.log(`   Email   : ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name    : ${name}`);
    console.log(`   Role    : helper (verified)`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected. Done!');
}

run().catch(err => { console.error('❌ Error:', err); process.exit(1); });
