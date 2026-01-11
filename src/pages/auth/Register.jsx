import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Store, User, Phone, Mail, Lock } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Logo from '../../components/common/Logo';
import { registerUser } from '../../redux/actions/authActions';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const result = await dispatch(registerUser(formData));
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <h2 className="text-2xl font-bold text-center mb-6">
            Register / पंजीकरण
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Shop Name"
              labelHindi="दुकान का नाम"
              type="text"
              value={formData.shopName}
              onChange={(e) => handleChange('shopName', e.target.value)}
              placeholder="e.g., Raj Kirana Store"
              icon={Store}
              required
            />

            <Input
              label="Owner Name"
              labelHindi="मालिक का नाम"
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              placeholder="e.g., Rajesh Kumar"
              icon={User}
              required
            />

            <Input
              label="Email"
              labelHindi="ईमेल (वैकल्पिक)"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              icon={Mail}
            />

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

            <Input
              label="Confirm Password"
              labelHindi="पासवर्ड की पुष्टि करें"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Re-enter password"
              icon={Lock}
              required
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Creating Account...' : 'Create Account / खाता बनाएं'}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;