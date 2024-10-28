"use client";

import supabaseClient from "@/services/supabase";
import { clientStore } from "@/stores/clientStore";
import { useEffect } from "react";

const Auth = () => {
  const { setSession } = clientStore();

  const getMeSession = async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    
    if (error) {
      console.log("Error while Fetching session");
    }
    else {
        setSession(data.session);
    }
  };

  useEffect(() => {
    getMeSession();
  }, []);

  return null;
};

export default Auth;
