import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  walletAddress: "",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addWallet: (state, action) => {
      state.walletAddress = action.payload;
    },
    removeWallet: (state) => {
      state.walletAddress = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { addWallet, removeWallet } = walletSlice.actions;

export default walletSlice.reducer;
