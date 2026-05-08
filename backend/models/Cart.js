import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
        qty: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
