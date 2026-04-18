import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String
  },
  { timestamps: true }
);

reviewSchema.index({ customer: 1, restaurant: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
