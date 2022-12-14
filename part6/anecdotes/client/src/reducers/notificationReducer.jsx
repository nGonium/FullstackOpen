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

export const setNotificationTimedout = (notification, timeout) => {
  return async (dispatch) => {
    dispatch(setNotification(notification));
    setTimeout(() => dispatch(removeNotification()), timeout * 1000);
  };
};

export default notificationSlice.reducer;
