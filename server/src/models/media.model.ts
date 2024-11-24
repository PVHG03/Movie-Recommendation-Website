import mongoose from "mongoose";

export interface MediaDocument extends mongoose.Document {
  _id: string; // mediaType-tmdbId
  tmdbId: string; // tmdb id
  mediaType: string; // movie or tv
  title: string;
  overview: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  genres: mongoose.Types.ObjectId[];
  videos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new mongoose.Schema<MediaDocument>(
  {
    _id: { type: String, required: true },
    tmdbId: { type: String, required: true },
    title: { type: String, required: true },
    overview: { type: String, required: true },
    posterPath: { type: String, required: true },
    backdropPath: { type: String, required: true },
    releaseDate: { type: String, required: true },
    genres: [{ type: String, ref: "Genre" }],
    mediaType: { type: String, required: true },
    videos: [{ type: String }],
  },
  { timestamps: true }
);

mediaSchema.pre("save", function (next) {
  this._id = `${this.mediaType}-${this.tmdbId}`;
  next();
});

mediaSchema.index({ tmdbId: 1, mediaType: 1 }, { unique: true });

export const Media = mongoose.model<MediaDocument>("Media", mediaSchema);
