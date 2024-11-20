import { TMDB_API_BASE_URL, TMDB_API_KEY } from "../constants/env";
import { BAD_REQUEST, CONFLICT, NOT_FOUND, OK } from "../constants/http";
import { Favorite } from "../models/favorite.model";
import { Media } from "../models/media.model";
import { Review } from "../models/review.model";
import { User } from "../models/user.model";
import { saveMediaToMongo } from "../services/media.service";
import { tmdbApi } from "../tmdb/tmdb.api";
import appAssert from "../utils/appAssert";
import axios from "../utils/axios";
import catchError from "../utils/catchError";
import neo4jClient from "../utils/Neo4j";

export const getMediaListHandler = catchError(async (req, res) => {
  const { mediaType, category } = req.params;
  const page = parseInt(<string>req.query.page) || 1;

  appAssert(mediaType, BAD_REQUEST, "Media type is required");
  appAssert(category, BAD_REQUEST, "Category is required");

  const response = await tmdbApi.mediaList({ mediaType, category, page });

  return res.status(OK).json({
    status: "success",
    data: response,
  });
});

export const getMediaHandler = catchError(async (req, res) => {
  const { mediaType, mediaId } = req.params;

  console.log(`This is getMediaHandler function`);

  appAssert(mediaType, BAD_REQUEST, "Media type is required");
  appAssert(mediaId, BAD_REQUEST, "Media id is required");

  let media = await Media.findById(`${mediaType}-${mediaId}`);
  if (!media) {
    console.log(`Media not found in database, saving to database`);
    const response = await tmdbApi.mediaDetail({ mediaType, mediaId });
    appAssert(response, NOT_FOUND, "Media not found");
    media = await saveMediaToMongo({ mediaId, mediaType });
    await neo4jClient.createNode({
      label: mediaType === "movie" ? "Movie" : "TVShow",
      properties: {
        _id: media._id,
        title: media.title,
        mediaType: media.mediaType,
      },
    });
  }

  return res.status(OK).json({
    status: "success",
    data: media,
  });
});

export const searchMediaHandler = catchError(async (req, res) => {
  const { mediaType } = req.params;
  const query = <string>req.query.q;
  const page = parseInt(<string>req.query.page) || 1;

  const response = await tmdbApi.search({ mediaType, query, page });

  appAssert(mediaType, BAD_REQUEST, "Media type is required");
  appAssert(query, BAD_REQUEST, "Query is required");

  return res.status(OK).json(response);
});

export const favoriteMediaHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;
  const userId = req.userId;

  appAssert(mediaId, BAD_REQUEST, "Media id is required");
  appAssert(mediaType, BAD_REQUEST, "Media type is required");

  let media = await Media.findById(`${mediaType}-${mediaId}`);
  if (!media) {
    console.log(`Media not found in database, saving to database`);
    media = await saveMediaToMongo({ mediaId, mediaType });
    await neo4jClient.createNode({
      label: mediaType === "movie" ? "Movie" : "TVShow",
      properties: {
        _id: media._id,
        title: media.title,
        mediaType: media.mediaType,
      },
    });
  }

  const favorite = await Favorite.findOne({ userId, mediaId: media._id });
  appAssert(!favorite, CONFLICT, "Media already favorited");

  const newFavorite = new Favorite({
    userId,
    mediaId: media._id,
  });
  await neo4jClient.createRelationship({
    startLabel: "User",
    startId: userId.toString(),
    endLabel: mediaType === "movie" ? "Movie" : "TVShow",
    endId: media._id,
    relationship: "FAVORITED",
    properties: {
      createdAt: new Date().toISOString(),
    },
  });
  await newFavorite.save();

  return res.status(OK).json({
    status: "success",
    data: newFavorite,
  });
});

export const unfavoriteMediaHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;
  const userId = req.userId;

  appAssert(mediaId, BAD_REQUEST, "Media id is required");
  appAssert(mediaType, BAD_REQUEST, "Media type is required");

  const media = await Media.findById(`${mediaType}-${mediaId}`);
  appAssert(media, NOT_FOUND, "Media not found");

  const favorite = await Favorite.findOne({ userId, mediaId: media._id });
  appAssert(favorite, NOT_FOUND, "Media not favorited");

  await neo4jClient.deleteRelationship({
    startLabel: "User",
    startId: userId.toString(),
    endLabel: mediaType === "movie" ? "Movie" : "TVShow",
    endId: media._id,
    relationship: "FAVORITED",
  });
  await favorite.deleteOne();

  return res.status(OK).json({
    status: "success",
    data: favorite,
  });
});

export const reviewMediaHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;
  const userId = req.userId;
  const { rating, comment } = req.body;

  appAssert(rating, BAD_REQUEST, "Rating is required");
  appAssert(comment, BAD_REQUEST, "Comment is required");
  appAssert(
    rating >= 0 && rating <= 5,
    BAD_REQUEST,
    "Rating must be between 0 and 5"
  );
  appAssert(
    comment.length <= 500,
    BAD_REQUEST,
    "Review must be less than 500 characters"
  );
  appAssert(mediaId, BAD_REQUEST, "Media id is required");
  appAssert(mediaType, BAD_REQUEST, "Media type is required");

  let media = await Media.findById(`${mediaType}-${mediaId}`);
  if (!media) {
    console.log(`Media not found in database, saving to database`);
    media = await saveMediaToMongo({ mediaId, mediaType });
    await neo4jClient.createNode({
      label: mediaType === "movie" ? "Movie" : "TVShow",
      properties: {
        _id: media._id,
        title: media.title,
        mediaType: media.mediaType,
      },
    });
  }

  const user = await User.findById(userId);
  appAssert(user, NOT_FOUND, "User not found");

  const review = await Review.findOne({ userId, mediaId: media._id });
  appAssert(!review, CONFLICT, "Media already reviewed");

  const newReview = new Review({
    userId,
    mediaId: media._id,
    rating,
    comment,
  });

  await neo4jClient.createRelationship({
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

  await newReview.save();

  return res.status(OK).json({
    status: "success",
    data: newReview,
  });
});

export const removeReviewMediaHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;
  const userId = req.userId;

  appAssert(mediaId, BAD_REQUEST, "Media id is required");
  appAssert(mediaType, BAD_REQUEST, "Media type is required");

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

  return res.status(OK).json({
    status: "success",
    data: review,
  });
});

export const editReviewMediaHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;
  const userId = req.userId;
  const { rating, comment } = req.body;

  appAssert(rating, BAD_REQUEST, "Rating is required");
  appAssert(comment, BAD_REQUEST, "Comment is required");
  appAssert(
    rating >= 0 && rating <= 5,
    BAD_REQUEST,
    "Rating must be between 0 and 5"
  );
  appAssert(
    comment.length <= 500,
    BAD_REQUEST,
    "Review must be less than 500 characters"
  );
  appAssert(mediaId, BAD_REQUEST, "Media id is required");
  appAssert(mediaType, BAD_REQUEST, "Media type is required");

  const media = await Media.findById(`${mediaType}-${mediaId}`);
  appAssert(media, NOT_FOUND, "Media not found");

  const review = await Review.findOne({ userId, mediaId: media._id });
  appAssert(review, NOT_FOUND, "Review not found");

  review.rating = rating;
  review.comment = comment;
  await review.save();

  await neo4jClient.updateRelationship({
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

  return res.status(OK).json({
    status: "success",
    data: review,
  });
});
