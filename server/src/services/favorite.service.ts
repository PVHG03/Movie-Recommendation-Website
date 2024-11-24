import mongoose, { ObjectId } from "mongoose";
import { CONFLICT, NOT_FOUND } from "../constants/http";
import { Favorite } from "../models/favorite.model";
import { Media } from "../models/media.model";
import appAssert from "../utils/appAssert";
import neo4jClient from "../utils/Neo4j";
import { fetchMediaDetails, saveMediaToMongo } from "./media.service";

interface FavoriteMediaParams {
  mediaId: string;
  mediaType: string;
  userId: mongoose.Types.ObjectId;
}

export const favoriteMedia = async (data: FavoriteMediaParams) => {
  const { mediaId, mediaType, userId } = data;

  const media = await fetchMediaDetails({ mediaId, mediaType });

  const favorite = await Favorite.findOne({ userId, mediaId: media._id });
  appAssert(!favorite, CONFLICT, "Media already favorited");

  const newFavorite = await Favorite.create({
    userId,
    mediaId: media._id,
  });
  await neo4jClient.Relationship({
    startLabel: "User",
    startId: userId.toString(),
    endLabel: mediaType === "movie" ? "Movie" : "TVShow",
    endId: media._id,
    relationship: "FAVORITED",
    properties: {
      createdAt: new Date().toISOString(),
    },
  });

  return newFavorite;
};

export const unfavoriteMedia = async (data: FavoriteMediaParams) => {
  const { mediaId, mediaType, userId } = data;

  const media = await Media.findById(`${mediaType}-${mediaId}`);
  appAssert(media, NOT_FOUND, "Media not found");

  const favorite = await Favorite.findOne({ userId, mediaId: media._id });
  appAssert(favorite, NOT_FOUND, "Favorite not found");

  await neo4jClient.deleteRelationship({
    startLabel: "User",
    startId: userId.toString(),
    endLabel: mediaType === "movie" ? "Movie" : "TVShow",
    endId: media._id,
    relationship: "FAVORITED",
  });

  await favorite.deleteOne();

  return favorite;
};
