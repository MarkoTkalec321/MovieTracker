import { config } from "../../lib/appwrite/config";
import { ID, Query } from 'react-native-appwrite';
import { databases } from '../../lib/appwrite/initializeClient';

export const getWatchlistEntryForMovie = async (userId, movieId) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.movieListCollectionId,
      [
        Query.equal("userId", userId),
        Query.equal("movieId", movieId)
      ]
    );
    if(response.documents.length > 0) {
      return response.documents[0].$id;
    }
    return null;

  } catch (error) {
    console.error("Error checking if movie exists in watchlist:", error);
    return null;
  }
};

export const getMovieWatchlistForUser = async (userId) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.movieListCollectionId,
      [Query.equal("userId", userId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    throw error;
  }
};

export const addMovieToWatchlist = async (userId, movieId) => {
  try {
    const response = await databases.createDocument(
      config.databaseId,
      config.movieListCollectionId,
      ID.unique(),
      {
        userId,
        movieId,
        savedAt: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    throw error;
  }
};

export const removeMovieFromWatchlist = async (documentId) => {
  try {
    const response = await databases.deleteDocument(
      config.databaseId,
      config.movieListCollectionId,
      documentId
    );
    return response;
  } catch (error) {
    console.error("Error removing movie from watchlist:", error);
    throw error;
  }
};
