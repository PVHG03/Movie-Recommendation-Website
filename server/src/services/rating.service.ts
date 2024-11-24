import mongoose from "mongoose";
import { CONFLICT, NOT_FOUND } from "../constants/http";
import { Media } from "../models/media.model";
import { Review } from "../models/review.model";
import appAssert from "../utils/appAssert";
import neo4jClient from "../utils/Neo4j";
import { saveMediaToMongo } from "./media.service";

interface RatingService {
  mediaId: string;
  mediaType: string;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

export const reviewMedia = async (data: RatingService) => {
  const { mediaId, mediaType, userId, rating, comment } = data;

  let media = await Media.findById(`${mediaType}-${mediaId}`);
  if (!media) {
    console.log(`Media not found in database, saving to database`);
    media = await saveMediaToMongo({ mediaId, mediaType });
    await neo4jClient.Node({
      label: mediaType === "movie" ? "Movie" : "TVShow",
      properties: {
        _id: media._id,
        title: media.title,
        mediaType: media.mediaType,
      },
    });
  }

  const review = await Review.findOne({ userId, mediaId: media._id });
  appAssert(!review, CONFLICT, "Media already reviewed");

  const newReview = await Review.create({
    userId,
    mediaId: media._id,
    rating,
    comment,
  });

  await neo4jClient.Relationship({
    startLabel: "User",
    startId: userId.toString(),
    endLabel: mediaType === "movie" ? "Movie" : "TVShow",
    endId: media._id,
    relationship: "REVIEWED",
    properties: {
      rating,
      comment,
      createdAt: new Date().toISOString(),
    },
  });

  return newReview;
};

export const editReviewMedia = async (data: RatingService) => {
  const { mediaId, mediaType, userId, rating, comment } = data;

  const media = await Media.findById(`${mediaType}-${mediaId}`);
  appAssert(media, NOT_FOUND, "Media not found");

  const review = await Review.findOne({ userId, mediaId: media._id });
  appAssert(review, NOT_FOUND, "Review not found");

  review.rating = rating;
  review.comment = comment;
  await review.save();

  await neo4jClient.Relationship({
    startLabel: "User",
    startId: userId.toString(),
    endLabel: mediaType === "movie" ? "Movie" : "TVShow",
    endId: media._id,
    relationship: "REVIEWED",
    properties: {
      rating,
      comment,
      updatedAt: new Date().toISOString(),
    },
  });

  return review;
};

export const deleteReviewMedia = async (data: RatingService) => {
  const { mediaId, mediaType, userId } = data;

  const media = await Media.findById(`${mediaType}-${mediaId}`);
  appAssert(media, NOT_FOUND, "Media not found");

  const review = await Review.findOne({ userId, mediaId: media._id });
  appAssert(review, NOT_FOUND, "Review not found");

  await neo4jClient.deleteRelationship({
    startLabel: "User",
    startId: userId.toString(),
    endLabel: mediaType === "movie" ? "Movie" : "TVShow",
    endId: media._id,
    relationship: "REVIEWED",
  });

  await review.deleteOne();

  return review;
};
