import { TMDB_API_BASE_URL, TMDB_API_KEY } from "../constants/env";
import { BAD_REQUEST, OK } from "../constants/http";
import { tmdbApi } from "../tmdb/tmdb.api";
import appAssert from "../utils/appAssert";
import axios from "../utils/axios";
import catchError from "../utils/catchError";

export const getMediaListHandler = catchError(async (req, res) => {
  const { mediaType, category } = req.params;
  const page = parseInt(<string>req.query.page) || 1;

  console.log(`This is getMediaListHandler function`);

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

  return res.status(OK).json({
    status: "success",
    data: response,
  });
});

export const searchMediaHandler = catchError(async (req, res) => {
  const { mediaType } = req.params;
  const query = <string>req.query.q;
  const page = parseInt(<string>req.query.page) || 1;

  console.log(`This is searchMediaHandler function`);

  const url = `${TMDB_API_BASE_URL}/search/${mediaType}?api_key=${TMDB_API_KEY}&query=${query}&page=${page}`;

  appAssert(mediaType, BAD_REQUEST, "Media type is required");
  appAssert(query, BAD_REQUEST, "Query is required");

  // const response = await tmdbApi.search({ mediaType: "movie", query: "avatar", page: 1 });

  const response = await axios.get(url);

  return res.status(OK).json(response);
});
