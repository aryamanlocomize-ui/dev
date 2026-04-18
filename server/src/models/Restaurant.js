import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    cuisines: [{ type: String }],
    priceForTwo: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    etaMins: { type: Number, default: 30 },
    imageUrl: String,
    address: String,
    location: {
      lat: Number,
      lng: Number
    },
    isOpen: { type: Boolean, default: true }
  },
  { timestamps: true }
);

restaurantSchema.index({ 'location.lat': 1, 'location.lng': 1 });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
