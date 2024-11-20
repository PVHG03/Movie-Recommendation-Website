import mongoose, { mongo } from "mongoose";

export interface ReviewDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  mediaId: string;
  rating: number;
  comment: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<ReviewDocument>(
  {
    mediaId: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, required: true, maxlength: 500 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Review = mongoose.model<ReviewDocument>("Review", reviewSchema);
