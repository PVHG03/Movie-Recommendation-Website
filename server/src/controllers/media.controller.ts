import { BAD_REQUEST, NOT_FOUND, OK } from "../constants/http";
import { Favorite } from "../models/favorite.model";
import { Review } from "../models/review.model";
import { favoriteMedia, unfavoriteMedia } from "../services/favorite.service";
import { fetchMediaDetails, saveMediaToMongo } from "../services/media.service";
import {
  deleteReviewMedia,
  editReviewMedia,
  reviewMedia,
} from "../services/rating.service";
import { tmdbApi } from "../tmdb/tmdb.api";
import appAssert from "../utils/appAssert";
import catchError from "../utils/catchError";

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

  const media = await fetchMediaDetails({ mediaType, mediaId });

  return res.status(OK).json({
    status: "success",
    data: media,
  });
});

export const getReiewsOfMediaHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;

  const reviews = await Review.find({ mediaId: `${mediaType}-${mediaId}` });

  if (reviews.length === 0) {
    appAssert(false, NOT_FOUND, "No reviews found for this media");
  }

  return res.status(OK).json({
    status: "success",
    count: reviews.length,
    data: reviews,
  });
});

export const getNumberOfFavoritesHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;

  const favorites = await Favorite.find({ mediaId: `${mediaType}-${mediaId}` });

  return res.status(OK).json({
    status: "success",
    count: favorites.length,
  });
})

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

  const newFavorite = await favoriteMedia({ mediaId, mediaType, userId });

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

  const favorite = await unfavoriteMedia({ mediaId, mediaType, userId });

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

  const newReview = await reviewMedia({
    mediaId,
    mediaType,
    userId,
    rating,
    comment,
  });

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

  const review = await deleteReviewMedia({
    mediaId,
    mediaType,
    userId,
    rating: 0,
    comment: "",
  });

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

  const review = await editReviewMedia({
    mediaId,
    mediaType,
    userId,
    rating,
    comment,
  });

  return res.status(OK).json({
    status: "success",
    data: review,
  });
});
