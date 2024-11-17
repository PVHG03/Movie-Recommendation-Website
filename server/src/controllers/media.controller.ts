import { TMDB_API_BASE_URL, TMDB_API_KEY } from "../constants/env";
import { BAD_REQUEST, CONFLICT, OK } from "../constants/http";
import { Favorite } from "../models/favorite.model";
import { Media } from "../models/media.model";
import { User } from "../models/user.model";
import { saveMediaToMongo } from "../services/media.service";
import { tmdbApi } from "../tmdb/tmdb.api";
import appAssert from "../utils/appAssert";
import axios from "../utils/axios";
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

  console.log(`This is getMediaHandler function`);

  appAssert(mediaType, BAD_REQUEST, "Media type is required");
  appAssert(mediaId, BAD_REQUEST, "Media id is required");

  const response = await tmdbApi.mediaDetail({ mediaType, mediaId });

  await saveMediaToMongo({ mediaId, mediaType });

  return res.status(OK).json({
    status: "success",
    data: response,
  });
});

export const searchMediaHandler = catchError(async (req, res) => {
  const { mediaType } = req.params;
  const query = <string>req.query.q;
  const page = parseInt(<string>req.query.page) || 1;

  const url = `${TMDB_API_BASE_URL}/search/${mediaType}?api_key=${TMDB_API_KEY}&query=${query}&page=${page}`;

  appAssert(mediaType, BAD_REQUEST, "Media type is required");
  appAssert(query, BAD_REQUEST, "Query is required");

  const response = await axios.get(url);

  return res.status(OK).json(response);
});

export const favoriteMediaHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;

  const existingMedia = await Media.findById(`${mediaType}-${mediaId}`);

  if (!existingMedia) {
    await saveMediaToMongo({ mediaId, mediaType });
  }

  const userId = req.userId;

  const isFavorite = await Favorite.findOne({
    userId,
    mediaId: `${mediaType}-${mediaId}`,
  });

  appAssert(!isFavorite, CONFLICT, "Media already favorited");

  const favorite = new Favorite({
    userId,
    mediaId: `${mediaType}-${mediaId}`,
  });

  await favorite.save();

  return res.status(OK).json({
    status: "success",
    data: favorite,
  });
});

export const unFavoriteMediaHandler = catchError(async (req, res) => {
  const { mediaId, mediaType } = req.params;
  const userId = req.userId;

  const favorite = await Favorite.findOneAndDelete({
    userId,
    mediaId: `${mediaType}-${mediaId}`,
  });

  appAssert(favorite, BAD_REQUEST, "Media is not favorited");

  return res.status(OK).json({
    status: "success",
    data: favorite,
  });
});

export const reviewMediaHandler = catchError(async (req, res) => {
  console.log(`This is reviewMediaHandler function`);
});

export const removeReviewMediaHandler = catchError(async (req, res) => {
  console.log(`This is unReviewMediaHandler function`);
});

export const editReviewMediaHandler = catchError(async (req, res) => {
  console.log(`This is editReviewMediaHandler function`);
});
