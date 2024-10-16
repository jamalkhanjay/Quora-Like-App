import supabaseClient from "@/services/supabase";

export const getAllData = async () => {
  const { data, error } = await supabaseClient.from("Feed").select("*");

  if (error) {
    console.log("Error updating the post data", error.message);
    return [];
  }
  return data;
};

export const addPost = async (title: string, description: string) => {
  const { error } = await supabaseClient
    .from("Feed")
    .insert({ post_title: title, description: description });

  if (error) {
    console.log("Error updating the post data", error.message);
    return false;
  }

  console.log("data added");
  return true;
};
