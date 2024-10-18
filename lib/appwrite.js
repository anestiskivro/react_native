import { Account, Avatars, Client, Databases, ID, Models, Query, Storage } from 'react-native-appwrite';

// Appwrite configuration
export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.react_native.aora',
  projectid: '67065459001a5b7a1383',
  databaseid: '67066ff6001de1ef4062',
  userCollectionid: '67067032001c159e2518',
  videosCollectionid: '67067082001677ce546c',
  storageid: '67067365000524247f4d',
  likesCollectionid: '6712368a0036586a20f2'
};

const { endpoint, platform, projectid, databaseid, userCollectionid, videosCollectionid, storageid,likesCollectionid } = appwriteConfig;

// Initialize React Native SDK
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectid)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client)
// Create a new user
export const createUser = async (email, password, username) => {
  try {

    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error("Failed to create new account");
    }

    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseid,
      appwriteConfig.userCollectionid,
      ID.unique(),
      {
        accountid: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    );


    if (!newUser) {
      throw new Error("Failed to create new user document");
    }

    return newUser;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error instanceof Error ? error : new Error('An unknown error occurred');
  }
};

// Sign in a user
export const signIn = async (email, password) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error('Error in signIn:', error);
    throw error instanceof Error ? error : new Error('An unknown error occurred during sign in');
  }
};

export const getCurrentUser = async () => {
  try {
    const currentaccount = await account.get();

    if (!currentaccount) throw Error;
    const currentuser = await databases.listDocuments(
      appwriteConfig.databaseid,
      appwriteConfig.userCollectionid,
      [Query.equal('accountid', currentaccount.$id)]
    )
    if (!currentuser) throw new Error;
    return currentuser.documents[0];
  } catch (error) {
    console.log(error)
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseid,
      videosCollectionid,
      [Query.orderDesc('$createdAt')]
    )
    return posts.documents;

  } catch (error) {
    throw new Error(error);
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseid,
      videosCollectionid,
      [Query.orderDesc('$createdAt', Query.limit(7))]

    )
    return posts.documents;

  } catch (error) {
    throw new Error(error);
  }

}
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      databaseid,
      videosCollectionid,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      databaseid,
      videosCollectionid,
      [Query.equal("creator", userId)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getFilePreview = async (fileId,type) => {
  let fileUrl;
  try {
    if(type === 'video'){
      fileUrl = storage.getFileView(storageid,fileId)
    }else if(type === 'image'){
      fileUrl = storage.getFilePreview(storageid,fileId,2000,2000,'top',100)
    }else {
      throw new Error('Invalid file type')
    }
    if(!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const uploadFile = async (file,type) => {
  if(!file) return;
  const {mimeType, ...rest} = file;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri:file.uri
  };

  try {
    const uploadedfile = await storage.createFile(
      storageid,
      ID.unique(),
      asset
    )
    const fileUrl = await getFilePreview(uploadFile.$id,type);
    return fileUrl;

  } catch (error) {
    throw new Error(error);
  }
}
export const createVideo = async (form) => {
  try {
    const [thumbnailUrl,videoUrl] = await Promise.all([
      uploadFile(form.thumbnail,'image'),
      uploadFile(form.video,'video'),
    ])
    const newPost = await databases.createDocument(
      databaseid,videosCollectionid,ID.unique(),{
        title:form.title,
        thumbnail:thumbnailUrl,
        video:videoUrl,
        prompt:form.prompt,
        creator:form.userId
      }
    )
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

export const createLike = async (id, title) => {
  try {
    const video = await databases.listDocuments(databaseid, videosCollectionid, [
      Query.equal("title", title)
    ]);

    if (video.documents.length === 0) {
      throw new Error('Video not found');
    }

    const videoDoc = video.documents[0];

    const alreadyLiked = await databases.listDocuments(
      databaseid,
      likesCollectionid,
      [
        Query.equal("User_id", id),
        Query.equal("Video_id", videoDoc.$id)
      ]
    );

    if (alreadyLiked.documents.length === 0) {
      await databases.updateDocument(databaseid, videosCollectionid, videoDoc.$id, {
        likes: videoDoc.likes + 1
      });

      const liked = await databases.createDocument(
        databaseid,
        likesCollectionid,
        ID.unique(),
        {
          User_id: id,
          Video_id: videoDoc.$id,
          Video_title: title
        }
      );
      console.log('Video liked successfully:', liked);
    } else {
      console.log('User has already liked this video.');
      return;
    }
  } catch (error) {
    console.error('Error liking the video:', error);
  }
};
export const getLikedVideos = async (userid) => {
  try {
    const liked = await databases.listDocuments(
      databaseid,
      likesCollectionid,
      [Query.equal("User_id", userid)]
    );
    if (!liked) throw new Error("Something went wrong");
    const videoTitles = liked.documents.map(video => video.Video_title);
    const videos = await databases.listDocuments(
      databaseid,
      videosCollectionid,
      [Query.equal("title", videoTitles)]
    );

    return videos.documents;
  } catch (error) {
    throw new Error(error);
  }
}