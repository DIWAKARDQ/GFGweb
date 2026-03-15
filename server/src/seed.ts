import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gfg-rit-hub';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db!;
    const usersCol = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCol.findOne({ email: 'admin@ritchennai.edu.in' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists, skipping...');
    } else {
      const adminPassword = await bcrypt.hash('admin123', 12);
      await usersCol.insertOne({
        name: 'GFG Admin',
        email: 'admin@ritchennai.edu.in',
        password: adminPassword,
        role: 'admin',
        streak: { current: 0, longest: 0, lastActive: new Date() },
        preferences: { theme: 'dark', language: 'en', notifications: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Admin created');
      console.log('   Email:    admin@ritchennai.edu.in');
      console.log('   Password: admin123');
    }

    // Check if student already exists
    const existingStudent = await usersCol.findOne({ email: 'karthik@ritchennai.edu.in' });
    if (existingStudent) {
      console.log('⚠️  Student already exists, skipping...');
    } else {
      const studentPassword = await bcrypt.hash('student123', 12);
      await usersCol.insertOne({
        name: 'Karthik Sundaramoorthy',
        email: 'karthik@ritchennai.edu.in',
        password: studentPassword,
        role: 'student',
        streak: { current: 12, longest: 25, lastActive: new Date() },
        github: { username: 'karthik_dev' },
        preferences: { theme: 'dark', language: 'en', notifications: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Student created');
      console.log('   Email:    karthik@ritchennai.edu.in');
      console.log('   Password: student123');
    }

    console.log('\n🎉 Seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
