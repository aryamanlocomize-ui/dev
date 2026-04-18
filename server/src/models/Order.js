import mongoose from 'mongoose';
import { ORDER_STATUS } from '../utils/constants.js';

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: String,
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PLACED
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paymentMethod: { type: String, default: 'online' },
    subtotal: Number,
    deliveryFee: { type: Number, default: 40 },
    tax: { type: Number, default: 0 },
    totalAmount: Number,
    deliveryAddress: {
      address: String,
      lat: Number,
      lng: Number
    },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        note: String
      }
    ]
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
