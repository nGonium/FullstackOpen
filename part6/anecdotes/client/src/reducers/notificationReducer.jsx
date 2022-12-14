import { createSlice } from '@reduxjs/toolkit';

let timeoutID;
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

export const setNotificationTimedout = (notification, timeoutSeconds) => {
  clearTimeout(timeoutID);
  return async (dispatch) => {
    dispatch(setNotification(notification));
    timeoutID = setTimeout(
      () => dispatch(removeNotification()),
      timeoutSeconds * 1000
    );
  };
};

export default notificationSlice.reducer;
