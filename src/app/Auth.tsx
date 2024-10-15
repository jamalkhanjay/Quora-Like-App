"use client";

import supabaseClient from "@/services/supabase";
import { clientStore } from "@/stores/clientStore";
import React, { useEffect } from "react";

const Auth = () => {
  const { setSession, session } = clientStore();

  const getMeSession = async () => {
    const { data, error } = await supabaseClient.auth.getSession();
    // console.log(data.session);
    
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
