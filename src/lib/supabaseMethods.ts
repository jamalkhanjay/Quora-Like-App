import supabaseClient from "@/services/supabase";

// ----------------- *** Get Post Table Data *** -------------------------------------
export const getPostData = async () => {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*, votes(*), comments(*)");

  if (error) {
    console.log("Error updating the post data", error.message);
    return [];
  }
  console.log(data);
  return data;
};

// Specific user data
export const fetchSpecificUsers = async (user_id?: string) => {
  const { data, error } = await supabaseClient
    .from("posts")
    .select("*, votes(*), comments(*)")
    .eq("user_id", user_id);

  if (error) {
    console.log("Error while fetching the post for current user");
    throw error;
  }

  if (data) {
    return data;
  }
};

// ----------------- *** Adding a new post *** -------------------------------------
export const addPost = async (
  title?: string,
  description?: string,
  uuid?: string | undefined,
  username?: string | undefined,
  imageUrl?: string,
  profileImgUrl?: string,
  videoUrl?: string
) => {
  const { error } = await supabaseClient.from("posts").insert({
    post_title: title,
    description,
    user_id: uuid,
    post_added_by: username,
    post_img_url: imageUrl,
    user_image: profileImgUrl,
    post_videos_url: videoUrl,
  });

  if (error) {
    console.log("Error updating the post data", error.message);
    return { isPostAdded: false, error };
  }

  console.log("data added");
  return { isPostAdded: true, error: null };
};

// ----------------- *** Getting vote Data *** -------------------------------------

// export const fetchVoteData = async () => {
//   const { data, error } = await supabaseClient.from("votes").select("*");

//   if (error) {
//     console.log("Error while fetching Vote data", error.message);
//     throw error;
//   }

//   if (data) {
//     return data;
//   }
// };

// ----------------- *** Manage Vote vote data *** -------------------------------------
export const manageVotes = async (
  post_id: string,
  user_id: string | undefined,
  removeVote: boolean
) => {
  // remove the vote if it's already added on a post
  if (removeVote) {
    const { data, error } = await supabaseClient
      .from("votes")
      .delete()
      .eq("post_id", post_id)
      .eq("user_id", user_id);

    if (error) {
      console.log("Error removing the vote");
    }

    if (data) {
      console.log("Vote removed", data);
    }
    return false;
  }

  // Will added on new vote
  const { data, error } = await supabaseClient
    .from("votes")
    .insert({ post_id, user_id })
    .select()
    .single();

  if (error) {
    console.log("Error occured in adding vote", error.message);
    return error.code;
  }

  if (data) {
    console.log("the added data is ", data);
    return true;
  }
};

// ---------- *** Add new Comment *** ---------------
// export const fetchComments = async () => {
//   const {}
// }

// ---------- *** Add new Comment *** ---------------
export const addComment = async (
  post_id: string,
  user_id: string | undefined,
  contents: string,
  commented_by: string,
  user_image: string
) => {
  const { error } = await supabaseClient
    .from("comments")
    .insert({ post_id, user_id, contents, commented_by, user_image });

  if (error) {
    console.log("Error while fetching comments", error.message);
  }
};

// Fetching comments
export const fetchComments = async (post_id: string) => {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("*")
    .eq("post_id", post_id);

  if (error) {
    console.log("Error fetcing this comments");
  }

  return data;
};

// Updating the Credentials
export const updateCredentials = async (
  newName?: string,
  newAvatarUrl?: string
) => {
  const updateData: {
    data?: {
      userName?: string;
      avatar_url?: string;
    };
  } = {};

  if (newName || newAvatarUrl) {
    updateData.data = {};
    if (newName) updateData.data.userName = newName;
    if (newAvatarUrl) updateData.data.avatar_url = newAvatarUrl;
  }

  if (Object.keys(updateData).length === 0) {
    console.log("No data to update");
  }

  const { error } = await supabaseClient.auth.updateUser(updateData);

  if (error) {
    console.error("Error updating user:", error.message);
    return { isUserUpdated: false, error };
  }
  return { isUserUpdated: true, error: null };
};

// Fetch all messages
export const fetchMessages = async () => {
  const { data: messages, error } = await supabaseClient
    .from("chating")
    .select("*");

  if (error) {
    console.log("Error while fetching messages data");
    throw error;
  }

  return messages;
};

export const insertMessage = async (
  message: string,
  userName: string,
  userImage: string
) => {
  const { error } = await supabaseClient
    .from("chating")
    .insert({ content: message, user_name: userName, user_image: userImage });

  if (error) {
    console.log("error while adding new message");
  }
};

// ------------- *** USERS Tables Calls *** -----------------
// Fetch users
export const retrieveUsers = async (userName: string) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .neq("user_name", userName);

  if (error) {
    console.log("Error while fetching users from Users tables", error.message);
  }

  if (data) {
    return data;
  }
};

// Users table insertion
// export const insertUser = async (userName: string) => {
//   const { error } = await supabaseClient
//     .from("users")
//     .insert({ user_name: userName });
//   if (error) {
//     console.log("Error while inserting the user", error.message);
//   }
// };

// -------------- *** Conversation Tables Calls *** ---------------
// create conversation
export const createConversation = async (
  currentUserId: string | undefined,
  chatUserId: number
) => {
  const { error } = await supabaseClient
    .from("conversation")
    .insert({ current_user_id: currentUserId, user2_id: chatUserId });

  if (error) {
    console.log("Error while fetching data");
    return error.message;
  }
};

// Fetching the messages of specific user
export const retrieveMessages = async (chatUserId: number) => {
  const { data, error } = await supabaseClient
    .from("conversation")
    .select("messages")
    .eq("user2_id", chatUserId)
    .single();

    if (error) {
      console.log("Error while fetching messages column from converstion table", error.message)
      throw error;
    }

    if (data) { 
      return data.messages;
    }
};

// interface DataOfMessage {
//   senderId: string | undefined;
//   content: string;
// }

export const updateColumn = async (dataToBeSent: any[], chatUserId: number) => {
  const { error } = await supabaseClient
    .from("conversation")
    .update({ messages: dataToBeSent })
    .eq("user2_id", chatUserId)
    .select();

  if (error) {
    console.log("Error while sending the message", error.message);
  }
};
