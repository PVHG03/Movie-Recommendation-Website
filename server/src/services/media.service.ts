import { CONFLICT, NOT_FOUND } from "../constants/http";
import { Genre } from "../models/genre.model";
import { Media, MediaDocument } from "../models/media.model";
import { tmdbApi } from "../tmdb/tmdb.api";
import appAssert from "../utils/appAssert";

export const saveMediaToMongo = async ({
  mediaId,
  mediaType,
}: {
  mediaId: string;
  mediaType: string;
}) => {
  const existingMedia = await Media.findOne({
    tmdbId: mediaId,
    mediaType: mediaType,
  });

  appAssert(!existingMedia, CONFLICT, "Media already exists");

  const response = await tmdbApi.mediaDetail({
    mediaType,
    mediaId,
  });

  appAssert(response, NOT_FOUND, "Media not found");

  if (response.genres && response.genres.length > 0) {
    await saveGenresToMongo(response.genres);
  }
  
  const media = new Media({
    _id: `${mediaType}-${mediaId}`,
    tmdbId: mediaId,
    mediaType,
    title: response.title || response.name || response.original_name || response.original_title,
    overview: response.overview,
    posterPath: response.poster_path,
    backdropPath: response.backdrop_path,
    releaseDate: response.release_date || response.first_air_date,
    genres: response.genres.map((genre: any) => genre.id),
    video: response.video,
  });

  await media.save();

  return media;
};

export const saveGenresToMongo = async (
  genres: { id: string; name: string }[]
) => {

  if (genres.length === 0 || !genres) {
    return;
  }

  const bulkOps = genres.map((genre) => ({
    updateOne: {
      filter: { _id: genre.id },
      update: { name: genre.name },
      upsert: true,
    },
  }))

  return Genre.bulkWrite(bulkOps);
};
