import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    ownerBio: { type: String }, // New field for the owner's story
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    logo: { type: String },
    banner: { type: String },
    images: { type: [String], default: [] },
    phone: { type: String },
    email: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
    isApproved: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: true },
    openTime: { type: String, default: '09:00 AM' },
    closeTime: { type: String, default: '09:00 PM' },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    deliveryRadius: { type: Number, default: 10 }, // km
  },
  {
    timestamps: true,
  }
);

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
