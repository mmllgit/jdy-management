import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface teacherInfo {
  option: string;
  startTime: string;
  endTime: string;
  name: string;
}

const initialState: teacherInfo = {
  option: "",
  startTime: "",
  endTime: "",
  name: "",
};

export const searchTeacherStateSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateTeacherState: (state, action) => {
      [
        state.option = state.option,
        state.startTime = state.startTime,
        state.endTime = state.endTime,
        state.name = state.name,
      ] = [
        action.payload.option,
        action.payload.startTime,
        action.payload.endTime,
        action.payload.name,
      ];
    },
  },
});

export const { updateTeacherState: updateTeacherStateAC } =
  searchTeacherStateSlice.actions;
