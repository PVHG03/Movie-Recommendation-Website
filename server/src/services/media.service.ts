import { CONFLICT } from "../constants/http";
import { Genre } from "../models/genre.model";
import { Media, MediaDocument } from "../models/media.model";
import { tmdbApi } from "../tmdb/tmdb.api";
import appAssert from "../utils/appAssert";
import catchError from "../utils/catchError";

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
  await saveGenresToMongo(response.genres);

  const media = new Media({
    _id: `${mediaType}-${mediaId}`,
    tmdbId: mediaId,
    mediaType,
    title: response.title || response.name,
    overview: response.overview,
    posterPath: response.poster_path,
    backdropPath: response.backdrop_path,
    releaseDate: response.release_date || response.first_air_date,
    genres: response.genres.map((genre: any) => genre.id),
    video: response.video,
  });

  await media.save();
};

export const saveGenresToMongo = async (
  genres: [{ id: string; name: string }]
) => {
  for (const genre of genres) {
    await Genre.updateOne(
      { _id: genre.id },
      { name: genre.name },
      { upsert: true }
    );
  }
};
