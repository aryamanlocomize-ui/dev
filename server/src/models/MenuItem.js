import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true
    },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    isVeg: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    imageUrl: String
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
