import { ID, Query } from 'react-native-appwrite';
import { config } from './config'; // if needed
import { account, databases } from './initializeClient';

export const createUser = async (email, password, username) => {
    try {
      const newAccount = await account.create(ID.unique(), email, password);
      
      if (!newAccount) throw Error;
      
      await signIn(email, password);

      const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email,
            username
        }
      )

      return newUser;

    } catch (error) {
      throw new Error(error);
    }
};

export const signIn = async (email, password) =>{
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const logOut = async () => {
  try {
    // "current" is the session ID for the currently active session
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error logging out:", error);
    throw new Error(error);
  }
}
