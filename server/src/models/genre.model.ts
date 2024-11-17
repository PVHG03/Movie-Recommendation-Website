import mongoose from "mongoose";

export interface GenreDocument extends mongoose.Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const genreSchema = new mongoose.Schema<GenreDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Genre = mongoose.model<GenreDocument>("Genre", genreSchema);
