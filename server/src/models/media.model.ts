import mongoose from "mongoose";

export interface MediaDocument extends mongoose.Document {
  tmdbId: string;
  
}