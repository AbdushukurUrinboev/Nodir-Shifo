import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { base_URL } from 'src/API';


const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;
    return {
      ...state,
      isAuthenticated: user ? true : false,
      user: user ? user : state.user,
      isLoading: false
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;
    let thisUserID = "";
    let isDoc = undefined;
    try {
      isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true';
      thisUserID = window.sessionStorage.getItem('userID');
      isDoc = window.sessionStorage.getItem('isDoctor');
    } catch (err) {
      console.error(err);
    }


    if (isAuthenticated) {
      if (thisUserID) {
        const fetchUserURL = isDoc === "true" ? `${base_URL}/doctors/${thisUserID}` : `${base_URL}/users/${thisUserID}`
        try {
          const serverResponse = await axios.get(fetchUserURL, { withCredentials: true, headers: { 'Content-Type': 'application/json' } })
          dispatch({
            type: HANDLERS.INITIALIZE,
            payload: { ...serverResponse.data, isDoctor: isDoc === "true" }
          });
        } catch (error) {
          dispatch({
            type: HANDLERS.INITIALIZE,
            payload: false
          });
        }

      } else {
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: false
        });
      }
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: false
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io'
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signIn = async (login, password, isDoctor) => {

    try {
      const postURL = isDoctor ? `${base_URL}/doctors/login` : `${base_URL}/users/login`
      const serverResponse = await axios.post(postURL, { login, password, rememberMe: true }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } })
      

      try {
        window.sessionStorage.setItem('authenticated', 'true');
        window.sessionStorage.setItem('userID', serverResponse.data.user._id);
        window.sessionStorage.setItem('isDoctor', isDoctor);
      } catch (err) {
        console.error(err);
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: { ...serverResponse.data.user, isDoctor }
      });
      
      return serverResponse.data.user.role

    } catch (err) {
      throw new Error('Iltimos Login va Parolni tekshiring');
    }



  };

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
