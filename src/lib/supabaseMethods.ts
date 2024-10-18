import supabaseClient from "@/services/supabase";

export const getPostData = async () => {
  const { data, error } = await supabaseClient.from("posts").select("*");

  if (error) {
    console.log("Error updating the post data", error.message);
    return [];
  }
  return data;
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

// Fetch Vote data
export const fetchVoteData = async (post_id: string, user_id: string | undefined) => {
  const { data, error } = await supabaseClient
    .from("votes")
    .select("post_id, user_id")
    .eq("post_id", post_id)
    .eq("user_id", user_id);

  if (error) {
    console.log("Error while fetching Vote data", error.message);
    throw error;
  }

  if(data){
    return {postId: data[0]?.post_id, userSessionId: data[0]?.user_id};
  }

  return {post_id: null, userSessionId: null};

};

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

export const fetchVoteType = async (
  post_id: string,
  user_id: string | undefined
) => {
  const { data, error } = await supabaseClient
    .from("votes")
    .select("vote_type")
    .eq("post_id", post_id)
    .eq("user_id", user_id);

  if (error) {
    console.log("Error white fetching type of vote", error.message);
    return false;
  }

  if (data) {
    return data[0]?.vote_type;
  }
};
