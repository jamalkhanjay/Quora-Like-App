import supabaseClient from "@/services/supabase";

export const getAllData = async () => {
  const { data, error } = await supabaseClient.from("posts").select("*");

  if (error) {
    console.log("Error updating the post data", error.message);
    return [];
  }
  return data;
};

export const getUserId = async (sessionId: string | undefined) => {
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

export const addPost = async (
  title: string,
  description: string,
  uuid: string | undefined,
  username: string | undefined
) => {
  const { error } = await supabaseClient
    .from("posts")
    .insert({
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
export const getMeSession = async () => {
  const { data, error } = await supabaseClient.auth.getSession();
  // console.log(data.session);

  if (error) {
    console.log("Error while Fetching session");
    return null;
  } else {
    return data.session;
  }
};
