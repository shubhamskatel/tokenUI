import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  loader: false,
};

export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loader = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading } = loaderSlice.actions;

export default loaderSlice.reducer;
