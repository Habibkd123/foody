import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Wishlist from '@/app/models/WishList';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  await connectDB();

  if (req.method === 'GET') {
    const wishlist = await Wishlist.findById(id).populate('user_id').populate('products');
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    return res.status(200).json(wishlist);
  }

  if (req.method === 'PUT') {
    try {
      const updatedWishlist = await Wishlist.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedWishlist) return res.status(404).json({ message: 'Wishlist not found' });
      return res.status(200).json(updatedWishlist);
    } catch (error) {
      return res.status(400).json({ message: 'Error updating wishlist', error });
    }
  }

  if (req.method === 'DELETE') {
    const deletedWishlist = await Wishlist.findByIdAndDelete(id);
    if (!deletedWishlist) return res.status(404).json({ message: 'Wishlist not found' });
    return res.status(200).json({ message: 'Wishlist deleted successfully' });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
