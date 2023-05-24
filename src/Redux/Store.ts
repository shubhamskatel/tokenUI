import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import walletSlice from "./slices/dataSlice";
import loaderSlice from "./slices/loaderSlice";
import initialValueSlice from "./slices/initialValueSlice";

const persistConfig = {
  key: "root",
  storage,
};

export const reducers = combineReducers({
  wallet: walletSlice,
  loader: loaderSlice,
  initialValues: initialValueSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
