import supabaseClient from "@/services/supabase";

export const getPostData = async () => {
  const { data, error } = await supabaseClient.from("posts").select("*");

  if (error) {
    console.log("Error updating the post data", error.message);
    return [];
  }
  return data;
};

// Getting user Id and name by passing a session id in params
export const getUserIdAndName = async (sessionId: string | undefined) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("uuid, username")
    .eq("main_userId", sessionId);

  if (error || !data || data.length === 0) {
    console.log("User not found or error fetching user", error?.message);
    return null;
  }

  return { uuid: data[0].uuid, username: data[0].username };
};

// Getting UUID of a user by passing a UUID of Post Table
export const getUserId = async (sessionId: any) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select("uuid")
    .eq("main_userId", sessionId);

  if (error || !data) {
    console.log("User not found or error fetching user", error?.message);
    return null;
  }

  return data[0]?.uuid;
};

// Adding a new post 
export const addPost = async (
  title: string,
  description: string,
  uuid: string | undefined,
  username: string | undefined
) => {
  const { error } = await supabaseClient.from("posts").insert({
    post_title: title,
    description,
    user_id: uuid,
    post_added_by: username,
  });

  if (error) {
    console.log("Error updating the post data", error.message);
    return false;
  }

  console.log("data added");
  return true;
};

// GETTING SESSION
// export const getMeSession = async () => {
//   const { data, error } = await supabaseClient.auth.getSession();
//   // console.log(data.session);

//   if (error) {
//     console.log("Error while Fetching session");
//     return null;
//   } else {
//     return data.session;
//   }
// };

// INSERT VOTE DATA
export const addVote = async (
  post_id: string,
  vote_type: boolean,
  user_id: string | undefined
) => {
  const { error } = await supabaseClient
    .from("votes")
    .insert({ post_id, vote_type, user_id });

  if (error) {
    console.log("Error occured in adding vote", error.message);
  }

  console.log("Upvote ");
};

// UPDATE VOTE TYPE WHEN IT IS Already CLICKED
export const updateVoteType = async (
  vote_type: boolean,
  post_id: string,
  user_id: string | undefined
) => {
  const { error } = await supabaseClient
    .from("votes")
    .update({ vote_type })
    .eq("post_id", post_id)
    .eq("user_id", user_id);

  if (error) {
    console.log("Error white updating Vote types", error.message);
  }
};
