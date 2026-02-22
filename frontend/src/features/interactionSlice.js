import { createSlice } from "@reduxjs/toolkit";

const interactionSlice = createSlice({
  name: "interaction",
  initialState: {
    interactions: [],
  },
  reducers: {
    addInteraction: (state, action) => {
      state.interactions.push(action.payload);
    },
  },
});

export const { addInteraction } = interactionSlice.actions;
export default interactionSlice.reducer;