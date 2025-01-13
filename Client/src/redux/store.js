import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "@/redux/slices/searchSlice";

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

// No `RootState` and `AppDispatch` types are needed in JavaScript.
