import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Logo from '../../components/common/Logo';
import { loginUser } from '../../redux/actions/authActions';
import { showToast } from '../../utils/toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.phone || !formData.password) {
      showToast.error('Please fill all fields / कृपया सभी फ़ील्ड भरें');
      return;
    }

    if (formData.phone.length !== 10) {
      showToast.error('Please enter valid 10-digit phone number');
      return;
    }

    const loadingToast = showToast.loading('Logging in...');
    const result = await dispatch(loginUser(formData));
    showToast.dismiss(loadingToast);
    
    if (result.success) {
      showToast.success('Login successful! / लॉगिन सफल!');
      navigate('/dashboard');
    } else {
      showToast.error(error || 'Login failed / लॉगिन विफल');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo and Title */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            दुकान खाता प्रबंधन
          </h1>
          <p className="text-gray-600">Shop Due Management System</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <h2 className="text-2xl font-bold text-center mb-6">Login / लॉगिन</h2>

            <div className="space-y-4">
              <Input
                label="Mobile Number"
                labelHindi="मोबाइल नंबर"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="10-digit mobile number"
                icon={Phone}
                maxLength={10}
                required
              />

              <Input
                label="Password"
                labelHindi="पासवर्ड"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter password"
                icon={Lock}
                required
              />

              <Button
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login / लॉगिन करें'
                )}
              </Button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <button className="text-sm text-blue-600 hover:underline block w-full">
                Forgot Password?
              </button>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Register here
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;