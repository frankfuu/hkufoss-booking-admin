import { configureStore, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const defaultPermissions: string[] = [];

interface UserDetails {
  username: string | null;
  roleId: number | null;
}

const defaultUserDetails: UserDetails = {
  username: null,
  roleId: null,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState: defaultPermissions,
  reducers: {
    setPermissions: (state, action) => {
      return action.payload; // Ensure payload is a plain array
    },
  },
});

// create the user details slice
const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: defaultUserDetails,
  reducers: {
    setUserDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUserDetails: () => {
      return defaultUserDetails;
    },
    updateUserDetail: (state, action) => {
      const { field, value } = action.payload;
      return { ...state, [field]: value };
    },
  },
});

export const { setPermissions } = permissionsSlice.actions;
export const { setUserDetails, clearUserDetails, updateUserDetail } = userDetailsSlice.actions;

const persistConfig = {
  key: "root",
  storage,
};

// persist both reducers
const persistedPermissionsReducer = persistReducer({ ...persistConfig, key: "permissions" }, permissionsSlice.reducer);
const persistedUserDetailsReducer = persistReducer({ ...persistConfig, key: "userDetails" }, userDetailsSlice.reducer);

// create the Redux store
const store = configureStore({
  reducer: {
    permissions: persistedPermissionsReducer,
    userDetails: persistedUserDetailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
        ignoredPaths: ["persist"],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
