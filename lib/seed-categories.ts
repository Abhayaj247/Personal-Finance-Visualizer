import Category from '@/models/Category';
import { connectToDatabase } from './db';


const defaultCategories = [
  { name: 'Food & Dining', color: '#FF5733', icon: 'utensils' },
  { name: 'Transportation', color: '#33FF57', icon: 'car' },
  { name: 'Housing', color: '#3357FF', icon: 'home' },
  { name: 'Utilities', color: '#F3FF33', icon: 'bolt' },
  { name: 'Entertainment', color: '#FF33F6', icon: 'film' },
  { name: 'Shopping', color: '#33FFF6', icon: 'shopping-bag' },
  { name: 'Health', color: '#FF3333', icon: 'heartbeat' },
  { name: 'Education', color: '#33FF33', icon: 'graduation-cap' },
  { name: 'Personal Care', color: '#3333FF', icon: 'user' },
  { name: 'Travel', color: '#FFFF33', icon: 'plane' },
  { name: 'Other', color: '#AAAAAA', icon: 'ellipsis-h' },
];

export async function seedCategories() {
  try {
    await connectToDatabase();

    const count = await Category.countDocuments();

    if (count === 0) {
      await Category.insertMany(defaultCategories);
      console.log('Default categories seeded successfully');
    } else {
      console.log('Categories already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}