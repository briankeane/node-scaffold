import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../Models/User';
// import { loginAPI, registerAPI } from "../Services/AuthService";
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import React from 'react';
import { toast } from 'react-toastify';

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  // registerUser: (email: string, username: string, password: string) => void;
  // loginUser: (username: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  loginUserWithRedirectToken: (token: string) => void;
};

type ServerJwtPayload = JwtPayload & {
  displayName: string;
  email: string;
  role: string;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
    setIsReady(true);
  }, []);

  // const registerUser = async (
  //   email: string,
  //   username: string,
  //   password: string
  // ) => {
  //   await registerAPI(email, username, password)
  //     .then((res) => {
  //       if (res) {
  //         localStorage.setItem("token", res?.data.token);
  //         const userObj = {
  //           displayName: res?.data.displayName,
  //           email: res?.data.email,
  //           role: res?.data.role,
  //         };
  //         localStorage.setItem("user", JSON.stringify(userObj));
  //         setToken(res?.data.token!);
  //         setUser(userObj!);
  //         toast.success("Login Success!");
  //         navigate("/search");
  //       }
  //     })
  //     .catch(() => toast.warning("Server error occured"));
  // };

  // const loginUser = async (username: string, password: string) => {
  //   await loginAPI(username, password)
  //     .then((res) => {
  //       if (res) {
  //         localStorage.setItem("token", res?.data.token);
  //         const userObj = {
  //           userName: res?.data.userName,
  //           email: res?.data.email,
  //         };
  //         localStorage.setItem("user", JSON.stringify(userObj));
  //         setToken(res?.data.token!);
  //         setUser(userObj!);
  //         toast.success("Login Success!");
  //         navigate("/search");
  //       }
  //     })
  //     .catch(() => toast.warning("Server error occured"));
  // };

  const loginUserWithRedirectToken = async (token: string) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    localStorage.setItem('token', token);
    setToken(token);
    let decodedUser = jwtDecode<ServerJwtPayload>(token);
    let user: UserProfile = {
      displayName: decodedUser.displayName,
      email: decodedUser.email,
      role: decodedUser.role,
    };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    toast.success('You are now Signed In!');
    navigate('/stations');
  };

  const isLoggedIn = () => {
    return !!token;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken('');
    navigate('/');
  };

  return (
    <UserContext.Provider
      value={{ loginUserWithRedirectToken, user, token, logout, isLoggedIn }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
