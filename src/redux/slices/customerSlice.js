import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    addCustomer: (state, action) => {
      state.customers.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(
        (c) => c.customerId === action.payload.customerId
      );
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(
        (c) => c.customerId !== action.payload
      );
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
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
  setCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setSelectedCustomer,
  setLoading,
  setError,
} = customerSlice.actions;

export default customerSlice.reducer;