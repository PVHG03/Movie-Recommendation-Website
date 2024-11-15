import { BAD_REQUEST, OK } from "../constants/http";
import appAssert from "../utils/appAssert";
import catchError from "../utils/catchError";
import { getMedia, getMedias, searchMedias } from "../utils/tmdb";

export const getMediaListHandler = catchError(async (req, res) => {
  const { mediaType } = req.params;
  const page = req.query.page ? Number(req.query.page) : 1;

  appAssert(mediaType, BAD_REQUEST, "Media type is required");

  const medias = await getMedias(mediaType, Number(page));
  return res.status(OK).json(medias);
});

export const getMediaHandler = catchError(async (req, res) => {
  const { mediaType, id } = req.params;

  appAssert(mediaType, BAD_REQUEST, "Media type is required");
  appAssert(id, BAD_REQUEST, "Media ID is required");

  const media = await getMedia(mediaType, id);
  return res.status(OK).json(media);
});

export const searchMediaHandler = catchError(async (req, res) => {
  const { mediaType } = req.params;
  const query  = req.query.query;
  const page = req.query.page ? Number(req.query.page) : 1;

  appAssert(mediaType, BAD_REQUEST, "Media type is required");
  appAssert(query, BAD_REQUEST, "Query is required");

  const medias = await searchMedias(mediaType, query as string, Number(page));
  return res.status(OK).json(medias);
});
