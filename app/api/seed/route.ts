import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category, { ICategory } from '@/app/models/Category';
import Product from '@/app/models/Product';
import User, { UserRole } from '@/app/models/User';
import InventoryItem from '@/app/models/InventoryItem';
import mongoose from 'mongoose';

// --- Data Generators ---

const FIRST_NAMES = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali'];
const LAST_NAMES = ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma'];
const LOCATIONS = [
    { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi', city: 'New Delhi', state: 'Delhi', zip: '110001' },
    { lat: 19.0760, lng: 72.8777, address: 'Bandra West, Mumbai', city: 'Mumbai', state: 'Maharashtra', zip: '400050' },
    { lat: 12.9716, lng: 77.5946, address: 'Indiranagar, Bangalore', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
];

const INVENTORY_ITEMS = [
    { name: 'Flour', unit: 'kg' }, { name: 'Sugar', unit: 'kg' }, { name: 'Milk', unit: 'L' }, { name: 'Eggs', unit: 'pcs' },
    { name: 'Chicken', unit: 'kg' }, { name: 'Rice', unit: 'kg' }, { name: 'Tomatoes', unit: 'kg' }, { name: 'Onions', unit: 'kg' },
    { name: 'Cheese', unit: 'kg' }, { name: 'Butter', unit: 'kg' }, { name: 'Oil', unit: 'L' }, { name: 'Salt', unit: 'kg' }
];

const CATEGORY_STRUCTURE = [
    { name: 'Meals', type: 'Lunch', subs: ['Burgers', 'Pizza', 'Pasta', 'Rice Bowls'] },
    { name: 'Beverages', type: 'Drinks', subs: ['Coffee', 'Tea', 'Soft Drinks', 'Juices'] },
    { name: 'Desserts', type: 'Sweets', subs: ['Cakes', 'Ice Cream', 'Pastries'] },
    { name: 'Snacks', type: 'Snacks', subs: ['Chips', 'Nuts', 'Fries'] }
];

const ADDON_GROUPS = [
    { name: 'Toppings', options: [{ name: 'Cheese', price: 20 }, { name: 'Olives', price: 15 }, { name: 'Jalapenos', price: 15 }] },
    { name: 'Size', selectionType: 'single', options: [{ name: 'Regular', price: 0 }, { name: 'Medium', price: 50 }, { name: 'Large', price: 100 }] },
    { name: 'Crust', selectionType: 'single', options: [{ name: 'Thin', price: 0 }, { name: 'Cheese Burst', price: 60 }] }
];

function r(arr: any[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function ri(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // Clear existing data (Optional: commented out for safety, but often good for seed)
        // await Promise.all([User.deleteMany({}), Product.deleteMany({}), Category.deleteMany({}), InventoryItem.deleteMany({})]);

        const createdUsers: any = { restaurant: [], driver: [], user: [] };
        const createdInventory: any[] = [];
        const createdCategories: any[] = [];

        // 1. Create Users (Restaurants, Drivers, Customers)
        console.log('Seeding Users...');
        for (let i = 0; i < 50; i++) {
            const role = i < 10 ? UserRole.RESTAURANT : i < 30 ? UserRole.DRIVER : UserRole.USER;
            const firstName = r(FIRST_NAMES);
            const lastName = r(LAST_NAMES);
            const loc = r(LOCATIONS);

            const userData: any = {
                firstName, lastName,
                email: `${role}${i}@test.com`,
                phone: `9999${ri(100000, 999999)}`,
                password: 'password123', // Will be hashed by model pre-save
                role,
                addresses: [{
                    label: 'Home',
                    address: loc.address,
                    city: loc.city,
                    state: loc.state,
                    zipCode: loc.zip,
                    lat: loc.lat,
                    lng: loc.lng,
                    isDefault: true
                }]
            };

            if (role === UserRole.RESTAURANT) {
                userData.restaurant = {
                    name: `${firstName}'s Kitchen`,
                    ownerName: `${firstName} ${lastName}`,
                    address: loc.address,
                    status: 'approved',
                    isOpen: true,
                    location: { lat: loc.lat, lng: loc.lng },
                    deliveryRadiusKm: 10,
                    openingTime: '09:00',
                    closingTime: '22:00',
                    rating: 4.5,
                    reviews: ri(10, 500)
                };
            } else if (role === UserRole.DRIVER) {
                userData.driverDetails = {
                    vehicleType: r(['bike', 'scooter']),
                    vehicleNumber: `DL-01-${ri(1000, 9999)}`,
                    licenseNumber: `LIC${ri(100000, 999999)}`,
                    status: 'approved',
                    isVerified: true,
                    isAvailable: true,
                    currentLocation: { lat: loc.lat, lng: loc.lng },
                    earnings: { total: ri(1000, 50000) }
                };
            }

            // Check if email exists to avoid dup error in this simple script
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                const user = await User.create(userData);
                createdUsers[role].push(user);
            }
        }

        // 2. Create Inventory items (Linked to Restaurants)
        console.log('Seeding Inventory...');
        if (createdUsers.restaurant.length > 0) {
            for (const rest of createdUsers.restaurant) {
                for (const item of INVENTORY_ITEMS) {
                    const exists = await InventoryItem.findOne({ restaurantId: rest._id, name: item.name });
                    if (!exists) {
                        const inv = await InventoryItem.create({
                            restaurantId: rest._id,
                            name: item.name,
                            unit: item.unit,
                            quantity: ri(10, 500),
                            lowStockThreshold: 10
                        });
                        createdInventory.push(inv);
                    }
                }
            }
        }

        // 3. Create Categories (Hierarchy)
        console.log('Seeding Categories...');
        for (const catStruct of CATEGORY_STRUCTURE) {
            let parent = await Category.findOne({ name: catStruct.name });
            if (!parent) {
                parent = await Category.create({
                    name: catStruct.name,
                    type: "See All", // Use a valid type or generic
                    description: `All kinds of ${catStruct.name}`,
                    status: 'active',
                    image: `https://picsum.photos/seed/${catStruct.name}/200`
                });
            }
            createdCategories.push(parent);

            for (const subName of catStruct.subs) {
                let sub = await Category.findOne({ name: subName });
                if (!sub) {
                    sub = await Category.create({
                        name: subName,
                        parent: parent?._id,
                        type: r(["New Arrivals", "Best Sellers", "Sweets", "Snacks", "Drinks", "Pantry", "Groceries", "Value Packs"]),
                        description: `Delicious ${subName}`,
                        status: 'active',
                        image: `https://picsum.photos/seed/${subName}/200`
                    });
                }
                createdCategories.push(sub);
            }
        }

        // 4. Create Products (Comprehensive)
        console.log('Seeding Products...');
        const productsToCreate = [];
        const plainCategories = createdCategories.filter(c => c.parent); // Use subcategories for products

        if (createdUsers.restaurant.length > 0 && plainCategories.length > 0) {
            for (let i = 0; i < 200; i++) {
                const restaurant = r(createdUsers.restaurant);
                const category = r(plainCategories);
                const basePrice = ri(100, 1000);

                // Find inventory for this restaurant to make recipe
                const restInventory = await InventoryItem.find({ restaurantId: restaurant._id }).limit(3);
                const recipe = restInventory.map(item => ({ item: item._id, qty: ri(1, 5) }));

                productsToCreate.push({
                    restaurantId: restaurant._id,
                    category: category._id,
                    name: `${r(['Spicy', 'Cheesy', 'Grilled', 'Crispy'])} ${category.name} ${i}`,
                    description: `An amazing description for this ${category.name}.`,
                    images: [`https://picsum.photos/seed/prod${i}/500/500`],
                    price: basePrice,
                    originalPrice: Math.floor(basePrice * 1.2),
                    stock: ri(0, 50),
                    inStock: true,
                    approvalStatus: 'approved',
                    status: 'active',
                    rating: ri(3, 5),
                    totalReviews: ri(0, 100),
                    recipe: recipe,
                    sku: `SKU-${Date.now()}-${i}`,
                    addonGroups: ADDON_GROUPS.map(g => ({
                        ...g,
                        options: g.options.map(o => ({ ...o, inStock: true }))
                    })),
                    variants: [
                        { name: 'Portion', selectionType: 'single', options: [{ name: 'Standard', price: 0 }, { name: 'Jumbo', price: 100, inStock: true }] }
                    ],
                    specifications: { "Energy": "400 kcal", "Serve": "1-2 persons" },
                    nutritionalInfo: { "Fat": "10g", "Protein": "20g" },
                    deliveryInfo: { freeDelivery: basePrice > 500, estimatedDays: '30-45 mins', expressAvailable: true },
                    tags: [category.name, 'Trending']
                });
            }

            // Batch insert is faster
            await Product.insertMany(productsToCreate);
        }

        return NextResponse.json({
            success: true,
            message: 'Comprehensive seeding completed',
            counts: {
                users: {
                    restaurant: createdUsers.restaurant.length,
                    driver: createdUsers.driver.length,
                    customer: createdUsers.user.length,
                },
                inventory: createdInventory.length,
                categories: createdCategories.length,
                products: productsToCreate.length
            }
        });

    } catch (error: any) {
        console.error('Seeding Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
