import { configureStore, createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// Define a default value for permissions
const defaultPermissions: string[] = []; // Start with an empty array

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: defaultPermissions, // Ensure this is an array
  reducers: {
    setPermissions: (state, action) => {
      return action.payload; // Ensure payload is a plain array
    },
  },
});

// Export actions
export const { setPermissions } = permissionsSlice.actions;

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, permissionsSlice.reducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    permissions: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['persist'],
      },
    }),
});

const persistor = persistStore(store);

// Export the store
export { store, persistor };

