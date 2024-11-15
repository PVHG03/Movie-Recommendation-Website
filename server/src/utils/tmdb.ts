import axios from "axios";
import { TMDB_API_BASE_URL, TMDB_API_KEY } from "../constants/env";
import appAssert from "./appAssert";
import { BAD_REQUEST } from "../constants/http";

async function fetchFromTMDB(endpoint: string, params = {}) {
  try {
    const response = await axios.get(`${TMDB_API_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response
      ? error.response.data.status_message
      : error.message;

    console.log("fetchFromTMDB", endpoint, params);
    console.log("fetchFromTMDB", error.response.data);

    appAssert(
      false,
      BAD_REQUEST,
      `Failed to fetch data from TMDB: ${errorMessage}`
    );
  }
}

export async function searchMedias(mediaType: string, query: string, page = 1) {
  return fetchFromTMDB(`/search/${mediaType}/anaoudboubfvioujsbiujsbov`, { query, page });
}

export async function getMedia(mediaType: string, id: string) {
  return fetchFromTMDB(`/${mediaType}/${id}`);
}

export async function getMedias(mediaType: string, page: number) {
  return fetchFromTMDB(`/${mediaType}/popular`, { page });
}
