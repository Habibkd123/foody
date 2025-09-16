import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/app/models/WishList'; // Your existing model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === 'GET') {
    // Get all wishlists (optional: you can add query by user_id)
    const wishlists = await Wishlist.find().populate('user_id').populate('products');
    return res.status(200).json(wishlists);
  }

  if (req.method === 'POST') {
    try {
      // Create a new wishlist
      const wishlist = await Wishlist.create(req.body);
      return res.status(201).json(wishlist);
    } catch (error) {
      return res.status(400).json({ message: 'Error creating wishlist', error });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
