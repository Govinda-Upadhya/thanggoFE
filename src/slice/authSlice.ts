import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string;
  booking_id: string;
}

const initialState: AuthState = {
  email: "",
  booking_id: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = "";
    },
    setBookingid: (state, action: PayloadAction<string>) => {
      state.booking_id = action.payload;
    },
    clearBookingId: (state) => {
      state.booking_id = "";
    },
  },
});

export const { setEmail, clearEmail, setBookingid, clearBookingId } =
  authSlice.actions;
export default authSlice.reducer;
