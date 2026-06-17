const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    // Fetch collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Simple raw query on products collection
    const productsCollection = mongoose.connection.db.collection('products');
    const products = await productsCollection.find({}).toArray();
    console.log(`Found ${products.length} products.`);

    // Find products with Aadhaar in images or names
    console.log('\n--- Checking for suspicious images (e.g. Aadhaar Card) ---');
    products.forEach(p => {
      const images = p.images || [];
      images.forEach(img => {
        if (img.toLowerCase().includes('aadhar') || img.toLowerCase().includes('card') || img.toLowerCase().includes('id') || img.toLowerCase().includes('pan')) {
          console.log(`Suspicious image in Product "${p.name}" (ID: ${p._id}): ${img}`);
        }
      });
      if (p.name.toLowerCase().includes('aalu') || p.name.toLowerCase().includes('potato')) {
        console.log(`Aalu/Potato Product found: "${p.name}" (ID: ${p._id}), images:`, p.images);
      }
    });

    // Check titles length
    console.log('\n--- Checking for long SEO titles ---');
    products.forEach(p => {
      if (p.name && p.name.length > 50) {
        console.log(`Long title: "${p.name}" (${p.name.length} chars)`);
      }
    });

    // Check categories
    console.log('\n--- Categories ---');
    const categoriesCollection = mongoose.connection.db.collection('categories');
    const categories = await categoriesCollection.find({}).toArray();
    categories.forEach(c => {
      console.log(`Category: "${c.name}" (ID: ${c._id}), icon: "${c.icon}", image: "${c.image}"`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
