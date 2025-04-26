// fetchWithRefresh.ts
import { HttpError } from "@refinedev/core";
import { k } from "../common/constants";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchWithRefresh = async (url: string, options?: RequestInit) => {
  const accessToken = localStorage.getItem(k.API_TOKEN_KEY);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // console.log(`Token expired, attempt to refresh....`);

    const refreshToken = localStorage.getItem(k.API_REFRESH_KEY);
    const refreshResponse = await fetch(`${API_URL}/auth/token/refresh`, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (refreshResponse.ok) {
      // console.log(`Refresh successful. Retrying the original request with new access token ... `);

      const data = await refreshResponse.json();
      localStorage.setItem(k.API_TOKEN_KEY, data.accessToken);
      localStorage.setItem(k.API_REFRESH_KEY, data.refreshToken);

      // Retry the original request with new access token
      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
    } else {
      // Handle refresh failure (e.g., logout the user)
      throw new Error("Refresh token expired");
    }
  }

  // if (!response.ok) {
  //   const respBody = await response.json();
  //   const error: HttpError = {
  //     message: response.statusText,
  //     statusCode: response.status,
  //     errors: respBody.message,
  //   };

  //   return Promise.reject(error);
  // }

  return response;
};
