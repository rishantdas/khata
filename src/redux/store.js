import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    transactions: transactionReducer,
  },
});

export default store;