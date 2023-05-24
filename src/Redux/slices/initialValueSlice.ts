import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  name: "",
  symbol: "",
  decimals: 0,
};

export const initialValueSlice = createSlice({
  name: "initialValues",
  initialState,
  reducers: {
    setInitialValues: (state, action) => {
      state.name = action.payload.name;
      state.symbol = action.payload.symbol;
      state.decimals = action.payload.decimals;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setInitialValues } = initialValueSlice.actions;

export default initialValueSlice.reducer;
