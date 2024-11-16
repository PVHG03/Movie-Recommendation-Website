import { TMDB_API_BASE_URL, TMDB_API_KEY } from "../constants/env";

async function getUrl(endpoint: string, params = {}) {
  const qs = new URLSearchParams({...params}).toString();

  return `${TMDB_API_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&${qs}`;
}

export default {getUrl};