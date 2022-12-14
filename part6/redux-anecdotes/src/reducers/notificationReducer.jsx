import { createSlice } from '@reduxjs/toolkit';

const initialState = '';
const notificationSlice = createSlice({
  initialState,
  name: 'notification',
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    removeNotification() {
      return '';
    },
  },
});

export const { setNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
