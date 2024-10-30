"use client";

import supabaseClient from "@/services/supabase";
import { clientStore } from "@/stores/clientStore";
import { userProfileStore } from "@/stores/userProfileStore";
import { useEffect } from "react";

const Auth = () => {
  const { session, setSession } = clientStore();
  const { setUser } = userProfileStore();

  const getMeSession = async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      console.log("Error while Fetching session");
    }
    else {
        setSession(data.session);
    }

    // Getting the data of that user profile
    if (session?.user) {
      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        console.log("Setting initial user:", profile);
        setUser(profile);
      }
    }
  };

  useEffect(() => {
    getMeSession();
  }, []);

  return null;
};

export default Auth;
