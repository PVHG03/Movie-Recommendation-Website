import axios from "../utils/axios";
import {
  tmdbEndpoint,
  tmdbMediaInterface,
  tmdbPersonInterface,
} from "./tmdb.endpoint";

export const tmdbApi = {
  mediaList: async ({ mediaType, category, page }: tmdbMediaInterface) =>
    await axios.get(
      await tmdbEndpoint.mediaList({ mediaType, category, page })
    ),
  mediaDetail: async ({ mediaType, mediaId }: tmdbMediaInterface) =>
    await axios.get(await tmdbEndpoint.mediaDetail({ mediaType, mediaId })),
  mediaCredits: async ({ mediaType, mediaId }: tmdbMediaInterface) =>
    await axios.get(await tmdbEndpoint.mediaCredits({ mediaType, mediaId })),
  personDetail: async ({ personId }: tmdbPersonInterface) =>
    await axios.get(await tmdbEndpoint.personDetail({ personId })),
  personCredits: async ({ personId }: tmdbPersonInterface) =>
    await axios.get(await tmdbEndpoint.personCredits({ personId })),
  search: async ({ mediaType, query, page }: tmdbMediaInterface) =>
    await axios.get(await tmdbEndpoint.search({ mediaType, query, page })),
  mediaImages: async ({ mediaType, mediaId }: tmdbMediaInterface) =>
    await axios.get(await tmdbEndpoint.mediaImages({ mediaType, mediaId })),
  mediaVideos: async ({ mediaType, mediaId }: tmdbMediaInterface) =>
    await axios.get(await tmdbEndpoint.mediaVideos({ mediaType, mediaId })),
};
