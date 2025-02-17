import { Client, Account, ID, Databases, Query, Storage, Avatars } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.tvz.movietracker',
    projectId: '67ad00ff00266d5290eb',
    databaseId: '67ad05b4000e9fdf86f6',
    userCollectionId: '67ad05d7000fef4dd71f',
    storageId: '67ad08ae001087092eee'
}

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

const account = new Account(client);
const databases = new Databases(client)

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
