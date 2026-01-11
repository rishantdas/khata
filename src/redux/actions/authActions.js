import { 
  loginStart, 
  loginSuccess, 
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure
} from '../slices/authSlice';

// Async thunk for login
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // TODO: Replace with actual API call
    // const response = await authService.login(credentials);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      shopkeeperId: `SK${Date.now()}`,
      shopName: 'Demo Shop',
      ownerName: 'Demo Owner',
      phone: credentials.phone,
    };
    
    dispatch(loginSuccess(mockUser));
    return { success: true };
  } catch (error) {
    dispatch(loginFailure(error.message || 'Login failed'));
    return { success: false };
  }
};

// Async thunk for register
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    
    // TODO: Replace with actual API call
    // const response = await authService.register(userData);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      shopkeeperId: `SK${Date.now()}`,
      shopName: userData.shopName,
      ownerName: userData.ownerName,
      phone: userData.phone,
      email: userData.email,
    };
    
    dispatch(registerSuccess(mockUser));
    return { success: true };
  } catch (error) {
    dispatch(registerFailure(error.message || 'Registration failed'));
    return { success: false };
  }
};