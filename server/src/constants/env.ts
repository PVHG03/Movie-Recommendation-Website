const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const PORT = getEnv("PORT");
export const NODE_ENV = getEnv("NODE_ENV");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const NEO4J_URI = getEnv("NEO4J_URI");
export const NEO4J_USER = getEnv("NEO4J_USER");
export const NEO4J_PASSWORD = getEnv("NEO4J_PASSWORD");
export const TMDB_API_KEY = getEnv("TMDB_API_KEY");
export const TMDB_API_BASE_URL = getEnv("TMDB_API_BASE_URL");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
