import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload); // Add to beginning for recent first
    },
    updateTransaction: (state, action) => {
      const index = state.transactions.findIndex(
        (t) => t.transactionId === action.payload.transactionId
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (t) => t.transactionId !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setLoading,
  setError,
} = transactionSlice.actions;

export default transactionSlice.reducer;