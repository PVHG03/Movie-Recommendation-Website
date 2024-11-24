import { BAD_REQUEST, CONFLICT, NOT_FOUND } from "../constants/http";
import { Genre } from "../models/genre.model";
import { Media, MediaDocument } from "../models/media.model";
import { tmdbApi } from "../tmdb/tmdb.api";
import appAssert from "../utils/appAssert";
import neo4jClient from "../utils/Neo4j";

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

  const mediaVideos = await tmdbApi.mediaVideos({ mediaType, mediaId });

  appAssert(response, NOT_FOUND, "Media not found");

  if (response.genres && response.genres.length > 0) {
    await saveGenresToMongo(response.genres);
  }

  const media = await Media.create({
    _id: `${mediaType}-${mediaId}`,
    tmdbId: mediaId,
    mediaType,
    title:
      response.title ||
      response.name ||
      response.original_name ||
      response.original_title,
    overview: response.overview,
    posterPath: response.poster_path,
    backdropPath: response.backdrop_path,
    releaseDate: response.release_date || response.first_air_date,
    genres: response.genres.map((genre: any) => genre.id),
    videos: mediaVideos.results.map((video: any) => video.key),
  });

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
  }));

  return Genre.bulkWrite(bulkOps);
};

interface MediaDetailsParams {
  mediaId: string;
  mediaType: string;
}

export const fetchMediaDetails = async (data: MediaDetailsParams) => {
  const { mediaId, mediaType } = data;

  appAssert(mediaId, BAD_REQUEST, "Media id is required");
  appAssert(mediaType, BAD_REQUEST, "Media type is required");

  let media = await Media.findById(`${mediaType}-${mediaId}`);
  if (!media) {
    console.log(`Media not found in database, saving to database`);
    const response = await tmdbApi.mediaDetail({ mediaType, mediaId });
    appAssert(response, NOT_FOUND, "Media not found");
    media = await saveMediaToMongo({ mediaId, mediaType });
    await neo4jClient.Node({
      label: mediaType === "movie" ? "Movie" : "TVShow",
      properties: {
        id: media._id,
        name: media.title,
        mediaType: media.mediaType,
      },
    });

    if (response.genres && response.genres.length > 0) {
      const genres = response.genres.map(
        (genre: { id: string; name: string }) => ({
          id: genre.id,
          name: genre.name,
        })
      );

      for (const genre of genres) {
        await neo4jClient.Node({
          label: "Genre",
          properties: genre,
        });

        await neo4jClient.Relationship({
          startLabel: mediaType === "movie" ? "Movie" : "TVShow",
          startId: media._id,
          endLabel: "Genre",
          endId: genre.id,
          relationship: "BELONGS_TO",
        });
      }
    }
  }

  return media;
};
