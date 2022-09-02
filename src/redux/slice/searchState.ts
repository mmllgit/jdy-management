import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface searchInfo {
  option: string;
  startTime: string;
  endTime: string;
}

const initialState: searchInfo = {
  option: "",
  startTime: "",
  endTime: "",
};

export const searchStateSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateState: (state, action) => {
      [
        state.option = state.option,
        state.startTime = state.startTime,
        state.endTime = state.endTime,
      ] = [
        action.payload.option,
        action.payload.startTime,
        action.payload.endTime,
      ];
    },
  },
});

export const { updateState: updateStateAC } = searchStateSlice.actions;
