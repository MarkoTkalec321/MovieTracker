import { config } from "../../lib/appwrite/config"; // Adjust the path to your config file
import { ID, Query } from 'react-native-appwrite';
import { databases } from '../../lib/appwrite/initializeClient';

export const getWatchlistEntryForShow = async (userId, showId) => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.showListCollectionId, // Make sure this is defined in your config
        [
          Query.equal("userId", userId),
          Query.equal("showId", showId)
        ]
      );
      if (response.documents.length > 0) {
        return response.documents[0].$id;
      }
      return null;
    } catch (error) {
      console.error("Error checking if show exists in watchlist:", error);
      return null;
    }
};
  
export const getShowWatchlistForUser = async (userId) => {
    try {
        const response = await databases.listDocuments(
        config.databaseId,
        config.showListCollectionId,
        [Query.equal("userId", userId)]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        throw error;
    }
};

export const addShowToWatchlist = async (userId, showId) => {
    try {
        const response = await databases.createDocument(
        config.databaseId,
        config.showListCollectionId,
        ID.unique(),
        {
            userId,
            showId,
            savedAt: new Date().toISOString(),
        }
        );
        return response;
    } catch (error) {
        console.error("Error adding show to watchlist:", error);
        throw error;
    }
};
  
export const removeShowFromWatchlist = async (documentId) => {
    try {
        const response = await databases.deleteDocument(
        config.databaseId,
        config.showListCollectionId,
        documentId
        );
        return response;
    } catch (error) {
        console.error("Error removing show from watchlist:", error);
        throw error;
    }
};