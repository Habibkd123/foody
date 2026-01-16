
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foody';

async function removeDuplicates() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const categories = await db.collection('categories').find().toArray();

        console.log(`Total Categories: ${categories.length}`);

        const seen = {};
        const toDelete = [];

        for (const cat of categories) {
            if (seen[cat.name]) {
                toDelete.push(cat._id);
            } else {
                seen[cat.name] = true;
            }
        }

        if (toDelete.length > 0) {
            console.log(`Found ${toDelete.length} duplicates to delete.`);
            const result = await db.collection('categories').deleteMany({ _id: { $in: toDelete } });
            console.log(`Deleted ${result.deletedCount} duplicate categories.`);
        } else {
            console.log('No duplicates found.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

removeDuplicates();
