import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuthContext } from 'src/contexts/auth-context';

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated, user } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      // Prevent from calling twice in development mode with React.StrictMode enabled
      if (ignore.current) {
        return;
      }
      ignore.current = true;

      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting');
        router
          .replace({
            pathname: '/auth/login',
            query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
          })
          .catch(console.error);
      } else {
        setChecked(true);
      }
    },
    [router.isReady]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

export const AllRouterGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated, user } = useAuthContext();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.
  const doctorAllowedRoutes = ['/doctorsPage'];
  const adminAllowedRoutes = ['/administration', '/doctors', '/companies', '/diseases'];
  const managerAllowedRoutes = ['/doctorsPage', '/navbat'];
  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      // Prevent from calling twice in development mode with React.StrictMode enabled
      if (ignore.current) {
        return;
      }
      ignore.current = true;

      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting');
        router
          .replace({
            pathname: '/auth/login',
            query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
          })
          .catch(console.error);
      } else {
        if (user.isDoctor) {
          if (doctorAllowedRoutes.includes(router.asPath)) {
            setChecked(true);
          } else {
            router
              .replace({
                pathname: '/restricted-page'
              })
              .catch(console.error);
          }
        } else {
          const thisUserRole = user?.role;
          if (thisUserRole === "admin") {
            if (adminAllowedRoutes.includes(router.asPath)) {
              setChecked(true);
            } else {
              router
                .replace({
                  pathname: '/restricted-page'
                })
                .catch(console.error);
            }
          } else if (thisUserRole === "manager") {
            if (!managerAllowedRoutes.includes(router.asPath)) {
              setChecked(true);
            } else {
              router
                .replace({
                  pathname: '/restricted-page'
                })
                .catch(console.error);
            }
            setChecked(true);
          } else if (thisUserRole === "developer") {
            setChecked(true);
          }
        }
      }
    },
    [router.isReady]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
AllRouterGuard.propTypes = {
  children: PropTypes.node
};
