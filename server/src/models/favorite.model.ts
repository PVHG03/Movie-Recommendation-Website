import mongoose from "mongoose";

export interface FavoriteDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  mediaId: string;
  createdAt: Date;
}

const favoriteSchema = new mongoose.Schema<FavoriteDocument>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaId: { type: String, ref: "Media", required: true },
  },
  { timestamps: true }
);

export const Favorite = mongoose.model<FavoriteDocument>("Favorite", favoriteSchema);