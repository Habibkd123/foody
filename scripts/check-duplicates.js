
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foody'; // Fallback if env not set, but env should be loaded

async function checkDuplicates() {
    try {
        if (!process.env.MONGODB_URI) {
            // Try to read .env file manually if needed, but usually run_command inherits env?
            // Let's assume user has it in env or we can find it.
            // Actually, let's look at .env file content first? No, I shouldn't unless necessary.
            // I'll assume connection string is available or use what's in lib/mongodb.ts
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const categories = await db.collection('categories').find().toArray();

        console.log(`Total Categories: ${categories.length}`);

        const names = {};
        const duplicates = [];

        categories.forEach(c => {
            if (names[c.name]) {
                duplicates.push(c.name);
            } else {
                names[c.name] = true;
            }
        });

        if (duplicates.length > 0) {
            console.log('Duplicate Categories Found:', duplicates);
            console.log('This confirms the "double double" UI issue.');
        } else {
            console.log('No duplicate category names found.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDuplicates();
