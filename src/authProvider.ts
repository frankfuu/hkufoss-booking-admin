import type { AuthProvider, CheckResponse, HttpError, OnErrorResponse } from "@refinedev/core";
import { k } from "./common/constants";
import { fetchWithRefresh } from "./common/fetch-with-refresh";
import { setUserDetails } from "./store/store";
import { store } from "./store/store";

const API_URL = import.meta.env.VITE_API_URL;

export const authProvider: AuthProvider = {
  login: async ({ username, email, password }) => {
    if ((username || email) && password) {
      let resp = await authenticateUser(email, password);
      const respJson = await resp?.json();
      const { accessToken, refreshToken, error, message } = respJson;

      if (resp?.ok) {
        localStorage.setItem(k.API_TOKEN_KEY, accessToken);
        localStorage.setItem(k.API_REFRESH_KEY, refreshToken);
        let redirectTo = "/home";

        try {
          let resp = await fetchWithRefresh(`${API_URL}/auth/me`);
          const data = await resp?.json();
          store.dispatch(setUserDetails(data));
          if (data.roleId == k.ROLES.ADMIN) {
            redirectTo = "/dashboard";
          }
        } catch (error) {
          return {
            success: false,
            error: {
              message: error,
              name: message,
            },
          };
        }

        return {
          success: true,
          redirectTo: redirectTo,
        };
      } else {
        return {
          success: false,
          error: {
            message: error,
            name: message,
          },
        };
      }
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(k.API_TOKEN_KEY);
    localStorage.removeItem(k.API_REFRESH_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    // console.log(`authProvider.check() called...`);

    const logoutCheckResp: CheckResponse = { authenticated: false, logout: true, redirectTo: "/login" };
    const rtok = localStorage.getItem(k.API_REFRESH_KEY);
    const atok = localStorage.getItem(k.API_TOKEN_KEY);

    if (!rtok || !atok) return logoutCheckResp;

    try {
      let resp = await fetchWithRefresh(`${API_URL}/auth/me`);
      const data = await resp?.json();

      return {
        authenticated: true,
        logout: false,
      };
    } catch (error) {
      return logoutCheckResp;
    }
  },
  getPermissions: async () => {
    const rawPermissions = store.getState().permissions;
    const permissions = Object.values(rawPermissions);

    return permissions ? permissions : [];
  },
  getIdentity: async () => {
    try {
      let resp = await fetchWithRefresh(`${API_URL}/auth/me`);
      const data = await resp?.json();
      return { ...data, avatar: "https://i.pravatar.cc/400" };
    } catch (error) {
      return null;
    }
  },
  onError: async (error: HttpError | Error | undefined) => {
    console.log(`authProvider.onError() called... the error is`);
    console.log(error);
    if ((error as HttpError)?.statusCode === 401) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }
    if ((error as HttpError)?.statusCode === 403) {
      return {
        logout: false,
        redirectTo: "/",
        error,
      };
    }
    return {};
  },
};

const authenticateUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
