import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import User from './models/User.js';
import Shop from './models/Shop.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import connectDB from './config/db.js';

const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin', phone: '1234567890' },
  { name: 'Shop Owner', email: 'owner@example.com', password: 'password123', role: 'owner', phone: '9876543210' },
  { name: 'Customer User', email: 'user@example.com', password: 'password123', role: 'user', phone: '5556667777' }
];

const categories = [
  { name: 'Grocery', icon: 'ShoppingBag', description: 'Fresh food and household items' },
  { name: 'Pharmacy', icon: 'PlusSquare', description: 'Medicines and healthcare' },
  { name: 'Electronics', icon: 'Smartphone', description: 'Gadgets and tech' },
  { name: 'Bakery', icon: 'Coffee', description: 'Bread and pastries' },
  { name: 'Fashion', icon: 'ShoppingBag', description: 'Clothing and accessories' },
  { name: 'Pet Care', icon: 'Dog', description: 'Food and supplies for your pets' },
  { name: 'Home Decor', icon: 'Home', description: 'Beautify your living space' },
  { name: 'Meat & Fish', icon: 'Utensils', description: 'Fresh non-veg options' },
  { name: 'Dairy', icon: 'Milk', description: 'Milk, butter, and cheese' },
  { name: 'Stationery', icon: 'PenTool', description: 'Books and office supplies' },
  { name: 'Hardware', icon: 'Wrench', description: 'Tools and building materials' },
  { name: 'Toys', icon: 'Gamepad2', description: 'Fun and games for all ages' }
];

const shops = [
  {
    name: 'Green Harvest Grocery',
    description: 'The freshest organic produce delivered from local farms to your kitchen.',
    categoryName: 'Grocery',
    address: { street: '123 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
    location: { type: 'Point', coordinates: [77.5946, 12.9716] },
    isApproved: true,
    rating: 4.8,
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1534723452862-4c874e90d66d?auto=format&fit=crop&w=300&q=80',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Wellness Pharmacy',
    description: 'Expert care and essential medical supplies for your family.',
    categoryName: 'Pharmacy',
    address: { street: '45 Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038' },
    location: { type: 'Point', coordinates: [77.6412, 12.9784] },
    isApproved: true,
    rating: 4.5,
    banner: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1587350859743-abc002737a6c?auto=format&fit=crop&w=300&q=80',
    images: ['https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'TechHub Electronics',
    description: 'Premium electronics and gadgets at neighborhood prices.',
    categoryName: 'Electronics',
    address: { street: '78 Koramangala', city: 'Bangalore', state: 'Karnataka', pincode: '560034' },
    location: { type: 'Point', coordinates: [77.6245, 12.9352] },
    isApproved: true,
    rating: 4.7,
    banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&q=80',
    images: ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Boulangerie Bakery',
    description: 'Artisan breads and delectable pastries baked fresh every morning.',
    categoryName: 'Bakery',
    address: { street: '22 HSR Layout', city: 'Bangalore', state: 'Karnataka', pincode: '560102' },
    location: { type: 'Point', coordinates: [77.6371, 12.9121] },
    isApproved: true,
    rating: 4.6,
    banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Paws & Whiskers',
    description: 'Everything your furry friends need, from premium nutrition to fun toys.',
    categoryName: 'Pet Care',
    address: { street: '55 Jayanagar', city: 'Bangalore', state: 'Karnataka', pincode: '560041' },
    location: { type: 'Point', coordinates: [77.5806, 12.9292] },
    isApproved: true,
    rating: 4.4,
    banner: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=300&q=80',
    images: ['https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&w=800&q=80']
  }
];

const products = [
  // Grocery
  {
    name: 'Red Gala Apples',
    description: 'Sweet, crunchy and directly sourced from Shimla orchards. Perfect for snacks and desserts.',
    price: 220, categoryName: 'Grocery', stock: 50, unit: 'kg', isFeatured: true, brand: 'ShimlaFarms',
    tags: ['Fresh', 'Organic', 'Fruit'],
    images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Premium Wildflower Honey',
    description: '100% pure raw honey with no added sugar. Rich in antioxidants and natural sweetness.',
    price: 450, categoryName: 'Grocery', stock: 30, unit: 'bottle', isFeatured: true, brand: 'NaturePure',
    tags: ['Honey', 'Natural', 'Organic'],
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1558583055-d7ac00b1adca?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Organic Hass Avocado',
    description: 'Creamy and nutrient-dense avocados, perfect for salads and toast.',
    price: 150, categoryName: 'Grocery', stock: 40, unit: 'piece', isFeatured: true, brand: 'GreenEarth',
    tags: ['Healthy', 'Superfood', 'Vegetable'],
    images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Fresh Blueberries',
    description: 'Antioxidant-rich fresh blueberries, handpicked for quality.',
    price: 350, categoryName: 'Grocery', stock: 25, unit: 'pack', isFeatured: false, brand: 'BerryNice',
    tags: ['Fruit', 'Berry', 'Healthy'],
    images: ['https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Organic Spinach',
    description: 'Freshly harvested nutrient-rich organic spinach leaves.',
    price: 45, categoryName: 'Grocery', stock: 60, unit: 'bunch', isFeatured: false, brand: 'FarmDirect',
    tags: ['Greens', 'Vegetable', 'Organic'],
    images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80']
  },

  // Electronics
  {
    name: 'Sony WH-1000XM4',
    description: 'Industry-leading noise cancelling wireless headphones with premium sound quality.',
    price: 24999, categoryName: 'Electronics', stock: 10, unit: 'unit', isFeatured: true, brand: 'Sony',
    tags: ['Audio', 'Premium', 'Wireless', 'NoiseCancelling'],
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Tactile mechanical switches with customizable RGB lighting.',
    price: 6500, categoryName: 'Electronics', stock: 15, unit: 'unit', isFeatured: true, brand: 'Razer',
    tags: ['Gaming', 'PC', 'RGB'],
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'MacBook Air M2',
    description: 'The thinnest and lightest laptop from Apple, completely transformed by the M2 chip.',
    price: 114900, categoryName: 'Electronics', stock: 5, unit: 'unit', isFeatured: true, brand: 'Apple',
    tags: ['Laptop', 'Work', 'Premium'],
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Sony PlayStation 5',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD and deeper immersion.',
    price: 54990, categoryName: 'Electronics', stock: 3, unit: 'unit', isFeatured: true, brand: 'Sony',
    tags: ['Gaming', 'Console', 'Entertainment'],
    images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced health monitoring and fitness tracking with a stunning OLED display.',
    price: 12999, categoryName: 'Electronics', stock: 20, unit: 'unit', isFeatured: false, brand: 'TechGear',
    tags: ['Wearable', 'Fitness', 'Tech'],
    images: ['https://images.unsplash.com/photo-1508685096489-7aac29145fe0?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80']
  },

  // Pharmacy
  {
    name: 'Digital Thermometer',
    description: 'Accurate and fast temperature readings with a digital display.',
    price: 250, categoryName: 'Pharmacy', stock: 100, unit: 'piece', isFeatured: false, brand: 'HealthCare',
    tags: ['Health', 'Tools', 'Safety'],
    images: ['https://images.unsplash.com/photo-1584362946025-0210ca539453?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'First Aid Kit Deluxe',
    description: 'Everything you need for emergencies at home or on the road.',
    price: 1500, categoryName: 'Pharmacy', stock: 30, unit: 'kit', isFeatured: true, brand: 'SafeFirst',
    tags: ['Safety', 'Medical', 'Emergency'],
    images: ['https://images.unsplash.com/photo-1603398938378-e54eab446f95?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Vitamin C Effervescent',
    description: '1000mg Vitamin C for daily immune support. Just drop in water.',
    price: 350, categoryName: 'Pharmacy', stock: 200, unit: 'pack', isFeatured: false, brand: 'DailyVital',
    tags: ['Supplements', 'Health', 'Immunity'],
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80']
  },

  // Bakery
  {
    name: 'Sourdough Loaf',
    description: 'Naturally leavened artisan sourdough with a perfect crust and tangy crumb.',
    price: 180, categoryName: 'Bakery', stock: 15, unit: 'loaf', isFeatured: true, brand: 'Boulangerie',
    tags: ['Bread', 'Artisan', 'Fresh'],
    images: ['https://images.unsplash.com/photo-1585478282206-1219d7b73b75?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Chocolate Ganache Cake',
    description: 'Rich dark chocolate cake layered with silky smooth ganache.',
    price: 850, categoryName: 'Bakery', stock: 5, unit: 'kg', isFeatured: true, brand: 'Boulangerie',
    tags: ['Dessert', 'Chocolate', 'Cake'],
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Butter Croissants',
    description: 'Flaky, buttery French-style croissants baked fresh daily.',
    price: 90, categoryName: 'Bakery', stock: 40, unit: 'piece', isFeatured: false, brand: 'Boulangerie',
    tags: ['Pastry', 'Breakfast', 'French'],
    images: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80']
  },

  // Pet Care
  {
    name: 'Premium Dog Food',
    description: 'Nutritious chicken and rice formula for adult dogs of all breeds.',
    price: 2400, categoryName: 'Pet Care', stock: 12, unit: '5kg', isFeatured: true, brand: 'Pawsome',
    tags: ['Dog', 'Food', 'Nutrition'],
    images: ['https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Interactive Cat Toy',
    description: 'Automatic laser toy to keep your feline friends active and entertained.',
    price: 850, categoryName: 'Pet Care', stock: 25, unit: 'unit', isFeatured: false, brand: 'MeowFun',
    tags: ['Cat', 'Toy', 'Interactive'],
    images: ['https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80']
  },
  {
    name: 'Memory Foam Pet Bed',
    description: 'Ultra-soft memory foam bed for superior joint support and comfort.',
    price: 3200, categoryName: 'Pet Care', stock: 8, unit: 'unit', isFeatured: true, brand: 'CloudRest',
    tags: ['Bed', 'Comfort', 'Sleep'],
    images: ['https://images.unsplash.com/photo-1591577900836-8e987cfee270?auto=format&fit=crop&w=800&q=80']
  }
];

export const importData = async () => {
  try {
    await User.deleteMany();
    await Shop.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    const createdUsers = await User.create(users);
    const ownerId = createdUsers[1]._id;
    const userId = createdUsers[2]._id;

    const createdCategories = await Category.create(categories);

    const sampleShops = shops.map((shop) => {
      const category = createdCategories.find(c => c.name === shop.categoryName);
      return { ...shop, owner: ownerId, category: category ? category._id : null };
    });
    const createdShops = await Shop.create(sampleShops);

    const sampleProducts = products.map((product) => {
      let assignedShop = createdShops.find(s => s.name.includes(product.categoryName)) || createdShops[0];
      if (product.categoryName === 'Grocery') assignedShop = createdShops[0];
      else if (product.categoryName === 'Pharmacy') assignedShop = createdShops[1];
      else if (product.categoryName === 'Electronics') assignedShop = createdShops[2];
      else if (product.categoryName === 'Bakery') assignedShop = createdShops[3];
      else if (product.categoryName === 'Pet Care') assignedShop = createdShops[4];

      const category = createdCategories.find(c => c.name === product.categoryName);
      return { ...product, shop: assignedShop._id, owner: ownerId, category: category ? category._id : null };
    });
    const createdProducts = await Product.create(sampleProducts);

    const sampleReviews = [
      { user: userId, product: createdProducts[0]._id, rating: 5, comment: 'Absolutely fresh and sweet! Highly recommended.' },
      { user: userId, product: createdProducts[5]._id, rating: 4, comment: 'Great sound quality, but a bit expensive.' },
      { user: userId, product: createdProducts[13]._id, rating: 5, comment: 'Best sourdough I have ever had.' }
    ];
    await Review.create(sampleReviews);

    const sampleOrder = {
      user: userId, shop: createdShops[0]._id,
      items: [{ product: createdProducts[0]._id, name: createdProducts[0].name, image: createdProducts[0].images[0], price: createdProducts[0].price, qty: 2 }],
      shippingAddress: { street: '123 Customer Lane', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
      paymentMethod: 'COD', paymentStatus: 'Pending', orderStatus: 'Placed', totalPrice: createdProducts[0].price * 2, deliveryCharge: 40,
    };
    await Order.create(sampleOrder);

    console.log('Data Imported Successfully with 30+ products and multiple photos!');
    return { success: true, message: 'Data Imported Successfully' };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

// Only run if called directly from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  dotenv.config();
  connectDB().then(() => importData()).then(() => process.exit()).catch(() => process.exit(1));
}
