import {
  initialSignInFormdata,
  initialSignUpFormdata,
} from "../../config/index";
import { createContext, useEffect, useState } from "react";
import {
  checkAuthService,
  loginService,
  registerService,
} from "@/services/index.js";
import { Skeleton } from "@/components/ui/skeleton";

// import { axiosInstance } from "@/api/axiosInsatance";

export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [signInFormdata, setSignInFormdata] = useState(initialSignInFormdata);
  const [signUpFormdata, setSignUpFormdata] = useState(initialSignUpFormdata);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  // console.log(signUpFormdata);

  async function handleRegisteruser(event) {
    event.preventDefault();

    const data = await registerService(signUpFormdata);
    console.log(data);
  }

  async function handleloginUser(event) {
    event.preventDefault();

    const data = await loginService(signInFormdata);

    if (data.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      setAuth({
        authenticate: true,
        user: data.data.checkUser,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  const resetCredentials = () => {
    setAuth({
      authenticate: false,
      user: null,
    });
  };

  // console.log(auth);

  return (
    <AuthContext.Provider
      value={{
        signInFormdata,
        setSignInFormdata,
        signUpFormdata,
        setSignUpFormdata,
        handleRegisteruser,
        handleloginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
