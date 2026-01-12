import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { addCustomer } from '../../redux/slices/customerSlice';

const AddCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required / ग्राहक का नाम आवश्यक है';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required / फोन नंबर आवश्यक है';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter valid 10-digit phone number / वैध 10 अंकों का फोन नंबर दर्ज करें';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const newCustomer = {
      customerId: `CUST${Date.now()}`,
      shopkeeperId: user?.shopkeeperId,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      totalDue: 0,
      createdAt: new Date().toISOString()
    };

    dispatch(addCustomer(newCustomer));
    alert('Customer added successfully! / ग्राहक सफलतापूर्वक जोड़ा गया!');
    navigate('/customers');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 text-white hover:text-blue-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Customers
          </button>
          <h1 className="text-2xl font-bold">Add New Customer / नया ग्राहक जोड़ें</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="space-y-6">
            <Input
              label="Customer Name"
              labelHindi="ग्राहक का नाम"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., राजेश कुमार"
              icon={User}
              required
            />
            {errors.name && (
              <p className="text-red-600 text-sm -mt-4">{errors.name}</p>
            )}

            <Input
              label="Phone Number"
              labelHindi="फोन नंबर"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="10-digit mobile number"
              icon={Phone}
              maxLength={10}
              required
            />
            {errors.phone && (
              <p className="text-red-600 text-sm -mt-4">{errors.phone}</p>
            )}

            <Input
              label="Address (Optional)"
              labelHindi="पता (वैकल्पिक)"
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g., मुख्य बाज़ार, दिल्ली"
              icon={MapPin}
            />

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSubmit} fullWidth>
                Add Customer / ग्राहक जोड़ें
              </Button>
              <Button 
                onClick={() => navigate('/customers')} 
                variant="outline"
                fullWidth
              >
                Cancel / रद्द करें
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Card */}
        {(formData.name || formData.phone) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Preview / पूर्वावलोकन</h3>
            <div className="bg-white rounded-lg shadow p-4 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {formData.name || 'Customer Name'}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Phone className="w-4 h-4" />
                    <span>{formData.phone || 'Phone Number'}</span>
                  </div>
                  {formData.address && (
                    <div className="text-sm text-gray-600 mt-2">
                      📍 {formData.address}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">₹0</div>
                  <div className="text-xs text-gray-500">Clear / क्लियर</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCustomer;