import supabaseClient from "@/services/supabase";

// ----------------- *** Get Post Table Data *** -------------------------------------
export const getPostData = async () => {
  const { data, error } = await supabaseClient.from("posts").select("*, votes(*)");

  if (error) {
    console.log("Error updating the post data", error.message);
    return [];
  }
  console.log(data)
  return data;
};

// ----------------- *** Adding a new post *** -------------------------------------
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

// ----------------- *** Getting vote Data *** -------------------------------------

export const fetchVoteData = async () => {
  const { data, error } = await supabaseClient.from("votes").select("*");

  if (error) {
    console.log("Error while fetching Vote data", error.message);
    throw error;
  }

  if (data) {
    return data;
  }
};

// ----------------- *** Mange Vote vote data *** -------------------------------------
export const manageVote = async (
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
