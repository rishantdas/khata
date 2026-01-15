import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FadeIn from '../../components/common/FadeIn';
import { addCustomer } from '../../redux/slices/customerSlice';
import { showToast } from '../../utils/toast';

const AddCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { customers } = useSelector((state) => state.customers);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
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
    } else {
      // Check for duplicate phone
      const exists = customers.find(c => c.phone === formData.phone);
      if (exists) {
        newErrors.phone = 'Customer with this phone number already exists / इस फोन नंबर वाला ग्राहक पहले से मौजूद है';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showToast.error('Please fix the errors / कृपया त्रुटियों को ठीक करें');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

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
    setIsSubmitting(false);
    showToast.success('Customer added successfully! / ग्राहक सफलतापूर्वक जोड़ा गया!');
    navigate('/customers');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={() => navigate('/customers')}
            className="flex items-center gap-2 text-white hover:text-blue-100 mb-4"
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Customers
          </motion.button>
          <h1 className="text-2xl font-bold">Add New Customer / नया ग्राहक जोड़ें</h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-6">
        <FadeIn>
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
                <motion.p 
                  className="text-red-600 text-sm -mt-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.name}
                </motion.p>
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
                <motion.p 
                  className="text-red-600 text-sm -mt-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.phone}
                </motion.p>
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
                <Button onClick={handleSubmit} disabled={isSubmitting} fullWidth>
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    'Add Customer / ग्राहक जोड़ें'
                  )}
                </Button>
                <Button 
                  onClick={() => navigate('/customers')} 
                  variant="outline"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Cancel / रद्द करें
                </Button>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Preview Card with Animation */}
        {(formData.name || formData.phone) && (
          <FadeIn delay={0.2} className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Preview / पूर्वावलोकन</h3>
            <motion.div 
              className="bg-white rounded-lg shadow p-4 border-2 border-blue-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

export default AddCustomer;