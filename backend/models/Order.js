import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    totalPrice: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
