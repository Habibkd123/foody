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
    console.log('Connected to MongoDB.');

    const productsCollection = mongoose.connection.db.collection('products');
    const categoriesCollection = mongoose.connection.db.collection('categories');

    // 1. Clean up "aalu" product
    // Set trimmed name "Aalu" and clean potato image (high-quality Unsplash image of fresh potatoes)
    const cleanPotatoImg = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80";
    const aaluUpdateResult = await productsCollection.updateMany(
      { $or: [ { name: /aalu/i }, { name: /potato/i } ] },
      { 
        $set: { 
          name: "Aalu (Potatoes)", 
          images: [ cleanPotatoImg ] 
        } 
      }
    );
    console.log(`Updated aalu products:`, aaluUpdateResult);

    // 2. Shorten long SEO titles for products
    const products = await productsCollection.find({}).toArray();
    let updatedProductsCount = 0;
    for (const p of products) {
      if (p.name) {
        let newName = p.name.trim();
        // Remove trailing descriptors or long pipes/colons
        if (newName.includes('|')) {
          newName = newName.split('|')[0].trim();
        }
        if (newName.includes(':')) {
          newName = newName.split(':')[0].trim();
        }
        if (newName.toLowerCase().includes('at india sweets and spices')) {
          newName = newName.replace(/at india sweets and spices/i, '').trim();
        }
        if (newName.toLowerCase().includes('corporate gifting')) {
          newName = newName.replace(/corporate gifting/i, '').trim();
        }

        if (newName.length > 50) {
          newName = newName.substring(0, 47) + '...';
        }

        if (newName !== p.name) {
          await productsCollection.updateOne({ _id: p._id }, { $set: { name: newName } });
          console.log(`Shortened product title: "${p.name}" -> "${newName}"`);
          updatedProductsCount++;
        }
      }
    }
    console.log(`Successfully shortened ${updatedProductsCount} product titles.`);

    // 3. Clean up category images and broken data
    // Fix Masala Category
    const masalaCat = await categoriesCollection.findOne({ name: "Masala" });
    if (masalaCat) {
      const cleanSpiceImg = "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80";
      await categoriesCollection.updateOne(
        { _id: masalaCat._id },
        { 
          $set: { 
            image: cleanSpiceImg,
            icon: "🌶️" 
          } 
        }
      );
      console.log('Updated Masala category image & icon.');
    }

    // Clean up generic dummy categories or fix undefined fields
    const categories = await categoriesCollection.find({}).toArray();
    let updatedCats = 0;
    for (const cat of categories) {
      let updateFields = {};
      if (cat.image === 'undefined' || !cat.image || cat.image.includes('blob:')) {
        // assign a nice unsplash placeholder image based on name
        const nameLower = cat.name.toLowerCase();
        let placeholderImg = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80"; // generic grocery
        if (nameLower.includes('burger')) placeholderImg = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80";
        if (nameLower.includes('pizza')) placeholderImg = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80";
        if (nameLower.includes('pasta')) placeholderImg = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80";
        if (nameLower.includes('coffee') || nameLower.includes('tea')) placeholderImg = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80";
        if (nameLower.includes('dessert') || nameLower.includes('cake') || nameLower.includes('ice cream')) placeholderImg = "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=80";
        if (nameLower.includes('salad')) placeholderImg = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80";
        if (nameLower.includes('rice')) placeholderImg = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80";
        
        updateFields.image = placeholderImg;
      }
      if (cat.icon === 'undefined' || !cat.icon) {
        updateFields.icon = ""; // clear string so code defaults to map
      }

      if (Object.keys(updateFields).length > 0) {
        await categoriesCollection.updateOne({ _id: cat._id }, { $set: updateFields });
        updatedCats++;
      }
    }
    console.log(`Cleaned up ${updatedCats} categories.`);

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
