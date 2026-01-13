import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  IndianRupee, 
  FileText, 
  Calendar,
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { addTransaction } from '../../redux/slices/transactionSlice';
import { updateCustomer } from '../../redux/slices/customerSlice';

const AddTransaction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { customers } = useSelector((state) => state.customers);
  const { user } = useSelector((state) => state.auth);

  const preSelectedCustomerId = searchParams.get('customerId');
  const preSelectedType = searchParams.get('type') || 'debit';

  const [formData, setFormData] = useState({
    customerId: preSelectedCustomerId || '',
    amount: '',
    type: preSelectedType,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find(c => c.customerId === formData.customerId);
      setSelectedCustomer(customer);
    }
  }, [formData.customerId, customers]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Please select a customer / कृपया एक ग्राहक चुनें';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount / कृपया वैध राशि दर्ज करें';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required / विवरण आवश्यक है';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required / तारीख आवश्यक है';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const amount = parseFloat(formData.amount);

    // Create transaction
    const newTransaction = {
      transactionId: `TXN${Date.now()}`,
      customerId: formData.customerId,
      shopkeeperId: user?.shopkeeperId,
      amount: amount,
      type: formData.type,
      description: formData.description,
      date: formData.date,
      createdAt: new Date().toISOString()
    };

    dispatch(addTransaction(newTransaction));

    // Update customer's total due
    const customer = customers.find(c => c.customerId === formData.customerId);
    if (customer) {
      const newDue = formData.type === 'debit' 
        ? customer.totalDue + amount 
        : customer.totalDue - amount;

      dispatch(updateCustomer({
        ...customer,
        totalDue: Math.max(0, newDue), // Don't allow negative due
        updatedAt: new Date().toISOString()
      }));
    }

    alert(
      formData.type === 'debit' 
        ? 'Purchase recorded successfully! / खरीद सफलतापूर्वक दर्ज की गई!'
        : 'Payment recorded successfully! / भुगतान सफलतापूर्वक दर्ज किया गया!'
    );

    navigate(`/customers/${formData.customerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-blue-100 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold">
            {formData.type === 'debit' 
              ? 'Record Purchase / खरीद दर्ज करें'
              : 'Record Payment / भुगतान दर्ज करें'
            }
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div className="space-y-6">
            {/* Transaction Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type / लेन-देन का प्रकार
              </label>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => handleChange('type', 'debit')}
                  className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    formData.type === 'debit'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  Purchase / खरीद
                </button>
                <button
                  onClick={() => handleChange('type', 'credit')}
                  className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    formData.type === 'credit'
                      ? 'bg-green-600 text-white shadow'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <TrendingDown className="w-5 h-5" />
                  Payment / भुगतान
                </button>
              </div>
            </div>

            {/* Customer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Customer / ग्राहक चुनें *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={formData.customerId}
                  onChange={(e) => handleChange('customerId', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a customer / ग्राहक चुनें</option>
                  {customers.map(customer => (
                    <option key={customer.customerId} value={customer.customerId}>
                      {customer.name} - {customer.phone} (Due: ₹{customer.totalDue})
                    </option>
                  ))}
                </select>
              </div>
              {errors.customerId && (
                <p className="text-red-600 text-sm mt-1">{errors.customerId}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount / राशि *
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description / विवरण *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder={formData.type === 'debit' ? 'e.g., किराना सामान, दूध, ब्रेड' : 'e.g., नकद भुगतान'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date / तारीख *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {errors.date && (
                <p className="text-red-600 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button onClick={handleSubmit} fullWidth variant="primary">
                {formData.type === 'debit' 
                  ? 'Record Purchase / खरीद दर्ज करें'
                  : 'Record Payment / भुगतान दर्ज करें'
                }
              </Button>
              <Button onClick={() => navigate(-1)} variant="outline" fullWidth>
                Cancel / रद्द करें
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Card */}
        {selectedCustomer && formData.amount && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Preview / पूर्वावलोकन
            </h3>
            <div className="bg-white rounded-lg shadow p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {selectedCustomer.name}
                  </h4>
                  <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                </div>
                <div className={`text-2xl font-bold ${formData.type === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                  {formData.type === 'debit' ? '+' : '-'}₹{parseFloat(formData.amount || 0).toLocaleString('en-IN')}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Due:</span>
                  <span className="font-semibold">₹{selectedCustomer.totalDue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {formData.type === 'debit' ? 'After Purchase:' : 'After Payment:'}
                  </span>
                  <span className="font-semibold text-blue-600">
                    ₹{Math.max(0, 
                      formData.type === 'debit' 
                        ? selectedCustomer.totalDue + parseFloat(formData.amount || 0)
                        : selectedCustomer.totalDue - parseFloat(formData.amount || 0)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {formData.description && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong> {formData.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTransaction;