import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Logo from '../../components/common/Logo';
import { loginUser } from '../../redux/actions/authActions';

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
    // Dispatch login action (we'll create this next)
    const result = await dispatch(loginUser(formData));
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            दुकान खाता प्रबंधन
          </h1>
          <p className="text-gray-600">Shop Due Management System</p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-center mb-6">Login / लॉगिन</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Mobile Number"
              labelHindi="मोबाइल नंबर"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
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
              placeholder="Enter password"
              icon={Lock}
              required
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Logging in...' : 'Login / लॉगिन करें'}
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
      </div>
    </div>
  );
};

export default Login;