import tmdbConfigs from "./tmdb.config";

export interface tmdbMediaInterface {
  mediaId?: string;
  mediaType?: string;
  category?: string;
  page?: number;
  query?: string;
}

export interface tmdbPersonInterface {
  personId?: string;
}

export const tmdbEndpoint = {
  mediaList: async ({ mediaType, category, page }: tmdbMediaInterface) =>
    tmdbConfigs.getUrl(`/${mediaType}/${category}`, { page }),
  mediaDetail: async ({ mediaType, mediaId }: tmdbMediaInterface) =>
    tmdbConfigs.getUrl(`/${mediaType}/${mediaId}`),
  mediaGenres: async ({ mediaType }: tmdbMediaInterface) =>
    tmdbConfigs.getUrl(`/genre/${mediaType}/list`),
  mediaCredits: async ({ mediaType, mediaId }: tmdbMediaInterface) =>
    tmdbConfigs.getUrl(`/${mediaType}/${mediaId}/credits`),
  mediaVideos: async ({ mediaType, mediaId }: tmdbMediaInterface) =>
    tmdbConfigs.getUrl(`/${mediaType}/${mediaId}/videos`),
  mediaImages: async ({ mediaType, mediaId }: tmdbMediaInterface) =>
    tmdbConfigs.getUrl(`/${mediaType}/${mediaId}/images`),
  search: async ({ mediaType, query, page }: tmdbMediaInterface) =>
    tmdbConfigs.getUrl(`/search/${mediaType}`, { query, page }),
  personDetail: async ({ personId }: tmdbPersonInterface) =>
    tmdbConfigs.getUrl(`/person/${personId}`),
  personCredits: async ({ personId }: tmdbPersonInterface) =>
    tmdbConfigs.getUrl(`/person/${personId}/combined_credits`),
};
