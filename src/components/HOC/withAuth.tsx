import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// import { RiseLoader } from 'react-spinners';
import supabase from '@/services/supabase';
// import { AbsoluteCenter, Box } from '@chakra-ui/react';
import { clientStore } from '@/stores/clientStore';

const withAuth = (WrappedComponent: React.ComponentType) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const WithAuthComponent: React.FC = (props: any) => {
    const router = useRouter();
    const { session, setSession } = clientStore();
    const pathname = usePathname();
    // const isAccessGranted = true; // can add additional checks of access of a specific page other than just authentication

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isAllowed, setIsAllowed] = useState<boolean>(false);

    // const additionalCheckForAccess = (path: string) => {
    //   if (isAccessGranted) {
    //     setIsAllowed(true);
    //   } else {
    //     setIsAllowed(false);
    //   }
    // };

    useEffect(() => {
      const checkUser = async () => {
        if (session?.access_token) {
          setIsAuthenticated(true);
          return;
        }
        const {
          data: { session: newSession },
          //OPTIMIZED_SESSION_DNR
        } = await supabase.auth.getSession();
        if (newSession) {
          setSession(newSession);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      };
      checkUser();
    }, [router, session, setSession]);

    useEffect(() => {
      if (isAuthenticated === true) {
        setIsAllowed(true);
        // additionalCheckForAccess(pathname);
      } else if (isAuthenticated === false) {
        if (['/signin', '/signup'].includes(pathname)) {
          setIsAuthenticated(true);
          setIsAllowed(true);
        } else {
          router.replace('/signin');
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, pathname, router]);

    return isAuthenticated && isAllowed ? <WrappedComponent {...props} /> : null;
  };
  return WithAuthComponent;
};

export default withAuth;
